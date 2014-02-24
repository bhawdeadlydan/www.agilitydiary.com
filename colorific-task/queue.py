#!/usr/bin/python
import os
import os.path
import subprocess
import sys
import optparse
import json
import shutil
import pika
import uuid
import logging
import urllib
import urllib2
#logging.basicConfig()

import colorific
from colorific import rgb_to_hex


from httplib2 import Http
from urllib import urlencode
import settings




def connect_to_queue():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(settings.RABBITMQ)
    )
    channel = connection.channel()
    channel.exchange_declare(exchange='amq.direct', type='direct', durable=True)

    return connection, channel




def process_file(input_file, filename):
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

    return data




def read_file_queue(settings, input_files):
    for input_file in input_files:
        filename = os.path.join(settings.INPUT_FILE_QUEUE, input_file)
        process_file(input_file, filename)




def reply(channel, url, body):
    #result = channel.queue_declare(queue=queue)
    #channel2 = CONNECTION.channel()
    #print('reply')
    #channel2.basic_publish(exchange='amq.direct',
    #    routing_key=queue,
    #    body=body
    #)
    data = urlencode(body)
    print(data)
    req = urllib2.Request(url, data)
    response = urllib2.urlopen(req)
    the_page = response.read()




def callback(channel, method, properties, body):
    data = json.loads(body)
    print " [x] Received %r" % (data,)

    channel.basic_ack(delivery_tag = method.delivery_tag)

    input_file = data['filename']
    new_filename = str(uuid.uuid4())
    filename = os.path.join(settings.INPUT_FILE_QUEUE, new_filename)

    #shutil.copy(input_file, filename)
    #response, content = h.request(data['fileUrl'])
    urllib.urlretrieve(data['fileUrl'], filename)


    out_data = process_file(new_filename, filename)
    out_data['return_data'] = data['returnData'];

    return_url = data['sender']['api']

    reply(channel, return_url, out_data )




def queue_watcher(settings):
    connection, channel = connect_to_queue()
    channel.queue_declare(queue=settings.QUEUE_NAME)

    channel.basic_consume(
        callback,
        queue=settings.QUEUE_NAME,
        no_ack=False
    )

    print ' [*] Waiting for messages. To exit press CTRL+C'
    channel.start_consuming()




if __name__=="__main__":
    queue_watcher(settings)
    #read_file_queue(settings, os.listdir(settings.INPUT_FILE_QUEUE))
