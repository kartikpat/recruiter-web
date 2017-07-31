#!/bin/bash
set -e
gulp build 
scp -r static/build/* ubuntu@13.126.238.47:/home/ubuntu/www/recruiter-web/static/build
git push prod master
