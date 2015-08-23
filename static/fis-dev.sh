#! /bin/bash
fis server start --type node --port 2017 --root ../app && fis release --file ../fis/dev.js --dest local --watch
