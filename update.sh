#!/bin/sh
kill -9 `ps -aux | grep "node"| head -1 |awk '{print $2}'`;git pull;node /root/sadbot/main.js 2>/root/sadbot/scratch/log &
