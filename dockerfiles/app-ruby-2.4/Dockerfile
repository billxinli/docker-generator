# docker build -t billli/app-ruby-2.4 .
# docker push billli/app-ruby-2.4

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
wget https://cache.ruby-lang.org/pub/ruby/2.4/ruby-2.4.2.tar.gz && \
tar -xvf ruby-2.4.2.tar.gz && \
cd ruby-2.4.2 && \
./configure && \
make -j $(getconf _NPROCESSORS_ONLN) && \
make install && \
cd .. && \
rm -rf ruby-2.4.2.tar.gz ruby-2.4.2
