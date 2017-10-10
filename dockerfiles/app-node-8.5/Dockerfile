# docker build -t billli/app-node-8.5 .
# docker push billli/app-node-8.5

FROM ubuntu:xenial
LABEL maintainer="me at my English first name dot last name"

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8
ENV LC_ALL en_US.UTF-8
ENV LC_TYPE en_US.UTF-8

RUN apt-get update && apt-get upgrade -y && \
apt-get install -y g++ libssl-dev git wget python build-essential openssl libssl-dev pkg-config autoconf libncurses5-dev locales && \
apt-get clean && apt-get autoclean && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && locale-gen

RUN cd /tmp && \
wget https://nodejs.org/dist/v8.5.0/node-v8.5.0.tar.gz && \
tar -xvf node-v8.5.0.tar.gz && \
cd node-v8.5.0 && \
./configure && \
make -j $(getconf _NPROCESSORS_ONLN) && \
make install && \
cd .. && \
rm -rf node-v8.5.0.tar.gz node-v8.5.0
