#!/usr/bin/env bash

docker build -t billli/app-elixir-1.5 ./dockerfiles/app-elixir-1.5
docker push billli/app-elixir-1.5

docker build -t billli/app-node-8.5 ./dockerfiles/app-node-8.5
docker push billli/app-node-8.5

docker build -t billli/app-ruby-2.4 ./dockerfiles/app-ruby-2.4
docker push billli/app-ruby-2.4

docker build -t billli/service-postgresql-9.5 ./dockerfiles/service-postgresql-9.5
docker push billli/service-postgresql-9.5

docker build -t billli/service-redis-3.0 ./dockerfiles/service-redis-3.0
docker push billli/service-redis-3.0