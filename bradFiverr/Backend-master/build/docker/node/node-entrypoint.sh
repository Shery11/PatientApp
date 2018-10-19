#!/bin/sh

npm install

supervisor --watch server/ server/index.js

