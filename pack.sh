#!/bin/bash

rm -rf packed
npm run tsc -w

mkdir packed

find . -regextype posix-egrep -regex ".*\.(html|css|json|js|js\.map|woff|woff2|ttf|png|jpg|ico|gif)$"  | cpio -pdm packed
# find . -regextype posix-egrep -regex "./node_modules/.*/*\.js$"  | cpio -pdm packed
# find . -maxdepth 1  -regextype posix-egrep -regex ".*\.(js)$" | cpio -pdm packed