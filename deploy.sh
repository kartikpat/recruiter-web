#!/bin/bash
set -e
gulp build 
scp -r static/build/* recruiter-web:/home/ubuntu/www/recruiter-web/static/build
scp configuration.json recruiter-web:/home/ubuntu/www/recruiter-web
git push -f testing `git branch | grep \* | cut -d ' ' -f2`:master
