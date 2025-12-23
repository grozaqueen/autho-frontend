#!/bin/sh
set -eu

: "${API_UPSTREAM:=http://main_service:8080}"

envsubst '${API_UPSTREAM}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf
