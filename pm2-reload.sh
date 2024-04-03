#!/bin/bash
sudo pm2 describe atomionics > /dev/null
RUNNING=$?

if [ "${RUNNING}" -ne 0 ]; then
  sudo pm2 start --name=atomionics --no-autorestart yarn -- start
else
  sudo pm2 restart atomionics
fi;