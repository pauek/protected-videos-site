#!/bin/bash
echo "["
for video in public/*.webm; do
  ffprobe -v quiet -print_format json -show_format "$video"
  echo ","
done
echo "]"
