#!/bin/bash
rsync /Users/adamauckland/Web/www.agilitydiary.com adam@Boxa:/home/adam/ -e ssh -av --exclude-from exclude.txt

