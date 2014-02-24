#!/usr/bin/python
import os
import os.path
import subprocess
import sys
import optparse
import json
import shutil
import pika
import logging
logging.basicConfig()

import colorific
from colorific import rgb_to_hex

import settings

CONNECTION = None

def connect_to_queue():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(settings.RABBITMQ)
    )
    global CONNECTION
    CONNECTION = connection

    channel = connection.channel()

    channel.exchange_declare(exchange='amq.direct', type='direct', durable=True)


    return connection, channel


def read_file_queue(settings, input_files):
    for input_file in input_files:
        filename = os.path.join(settings.INPUT_FILE_QUEUE, input_file)

        palette = colorific.extract_colors(
            filename,
            min_saturation=0.05,
            min_prominence=0.01,
            min_distance=10.0,
            max_colors=5,
            n_quantized=100)

        data = {
            'filename': filename,
            'colours': [rgb_to_hex(c.value) for c in palette.colors],
            'background': palette.bgcolor and rgb_to_hex(palette.bgcolor.value) or ''
        }

        out_file = os.path.join(settings.OUTPUT_FILE_QUEUE, input_file + '_data.json')
        with open(out_file, 'wt') as out_file:
            out_file.write(json.dumps(data))

        shutil.move(filename, os.path.join(settings.PROCESSED_FILE_QUEUE, input_file))


def reply(channel, queue, body):
    #result = channel.queue_declare(queue=queue)
    channel2 = CONNECTION.channel()
    print('reply')
    channel2.basic_publish(exchange='amq.direct',
        routing_key=queue,
        body=body
    )


def callback(channel, method, properties, body):
    data = json.loads(body)
    print " [x] Received %r" % (data,)

    channel.basic_ack(delivery_tag = method.delivery_tag)

    reply(channel, data['sender']['queue'], 'received')

def queue_watcher(settings):
    connection, channel= connect_to_queue()
    channel.queue_declare(queue=settings.QUEUE_NAME)

    channel.basic_consume(
        callback,
        queue=settings.QUEUE_NAME,
        no_ack=False
    )

    print ' [*] Waiting for messages. To exit press CTRL+C'
    channel.start_consuming()


if __name__=="__main__":
    #queue_watcher(settings)
    read_file_queue(settings, os.listdir(settings.INPUT_FILE_QUEUE))
