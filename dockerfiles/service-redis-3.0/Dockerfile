# docker build -t billli/service-redis .
# docker push billli/service-redis

FROM ubuntu:xenial
LABEL maintainer="me at my English first name dot last name"

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8
ENV LC_ALL en_US.UTF-8
ENV LC_TYPE en_US.UTF-8

RUN apt-get update && apt-get upgrade -y && \
apt-get install -y redis-server locales && \
apt-get clean && apt-get autoclean && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && locale-gen

VOLUME ["/etc/redis", "/var/log/redis/", "/var/lib/redis"]

EXPOSE 6379

CMD ["redis-server"]
