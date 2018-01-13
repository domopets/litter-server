#!/bin/bash

systemctl stop LitterServer.service
systemctl disable LitterServer.service
rm /etc/systemd/system/LitterServer.service
