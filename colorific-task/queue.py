#!/usr/bin/python
import os
import os.path
import subprocess
import sys
import optparse
import json
import shutil
import pika
import colorific
from colorific.palette import (
    extract_colors, print_colors, save_palette_as_image, color_stream_mt,
    color_stream_st)
import settings


def connect_to_queue():
    connection = pika.BlockingConnection(pika.ConnectionParameters(settings.RABBITMQ))
    channel = connection.channel()

    return connection, channel


def read_file_queue(settings, input_files):
    for input_file in input_files:
        filename = os.path.join(settings.INPUT_FILE_QUEUE, input_file)

        palette = extract_colors(
            filename,
            min_saturation=0.05,
            min_prominence=0.01,
            min_distance=10.0,
            max_colors=5,
            n_quantized=100)

        colour_data = print_colors(filename, palette)
        parsed_data = colour_data.split()[1].split(',')

        data = {
            'filename': input_file,
            'data': parsed_data
        }

        out_file = os.path.join(settings.OUTPUT_FILE_QUEUE, input_file + '_data.json')
        with open(out_file, 'wt') as out_file:
            out_file.write(json.dumps(data))

        shutil.move(filename, os.path.join(settings.PROCESSED_FILE_QUEUE, input_file))


def queue_watcher(settings):
    connection, channel = connect_to_queue()
    channel.queue_declare(queue='colorific')

    def callback(ch, method, properties, body):
        print " [x] Received %r" % (body,)

    channel.basic_consume(
        callback,
        queue='colorific',
        no_ack=True)

    print ' [*] Waiting for messages. To exit press CTRL+C'
    channel.start_consuming()


if __name__=="__main__":
    queue_watcher(settings)
