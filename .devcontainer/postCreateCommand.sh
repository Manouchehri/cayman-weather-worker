#!/bin/bash
apt-get update -y
apt-get upgrade -y
apt install libc++1 -y
npm install || echo "npm install failed"
