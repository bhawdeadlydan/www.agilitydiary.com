#!/usr/bin/python
import os
import os.path
import subprocess
import sys
import optparse
import json
import shutil

import colorific
from colorific.palette import (
    extract_colors, print_colors, save_palette_as_image, color_stream_mt,
    color_stream_st)
from celery import Celery

def create_directory(directory_name):
    if not os.path.exist(directory_name):
        os.makedirs(directory_name)

INPUT_FILE_QUEUE = os.path.abspath('./queue/in')
OUTPUT_FILE_QUEUE = os.path.abspath('./queue/out/')
PROCESSED_FILE_QUEUE = os.path.abspath('./queue/processed/')

create_directory(INPUT_FILE_QUEUE)
create_directory(OUTPUT_FILE_QUEUE)
create_directory(PROCESSED_FILE_QUEUE)

input_files = os.listdir(INPUT_FILE_QUEUE)

for input_file in input_files:
    filename = os.path.join(INPUT_FILE_QUEUE, input_file)

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

    out_file = os.path.join(OUTPUT_FILE_QUEUE, input_file + '_data.json')
    with open(out_file, 'wt') as out_file:
        out_file.write(json.dumps(data))

    shutil.move(filename, os.path.join(PROCESSED_FILE_QUEUE, input_file))

