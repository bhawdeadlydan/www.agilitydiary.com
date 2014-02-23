import os
import os.path


WORKSPACE = os.path.abspath("../workspace/colorific")
INPUT_FILE_QUEUE = os.path.join(WORKSPACE, "queue/in")
OUTPUT_FILE_QUEUE = os.path.join(WORKSPACE, "queue/out/")
PROCESSED_FILE_QUEUE = os.path.join(WORKSPACE, "queue/processed/")


def create_directory(directory_name):
    if not os.path.exists(directory_name):
        os.makedirs(directory_name)


create_directory(WORKSPACE)
create_directory(INPUT_FILE_QUEUE)
create_directory(OUTPUT_FILE_QUEUE)
create_directory(PROCESSED_FILE_QUEUE)
