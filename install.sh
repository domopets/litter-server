#!/bin/bash

cp systemd-LitterServer.service /etc/systemd/system/LitterServer.service
systemctl enable LitterServer.service
systemctl start LitterServer.service
