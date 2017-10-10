# docker build -t billli/app-elixir-1.5 .
# docker push billli/app-elixir-1.5

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
wget https://github.com/erlang/otp/archive/OTP-20.0.tar.gz && \
tar xfz OTP-20.0.tar.gz && \
cd otp-OTP-20.0 && \
./otp_build autoconf && \
./configure && \
make -j $(getconf _NPROCESSORS_ONLN) && \
make install && \
rm -rf OTP-20.0.tar.gz otp-OTP-20.0

RUN cd /tmp && \
wget https://github.com/elixir-lang/elixir/archive/v1.5.1.tar.gz && \
tar xfz v1.5.1.tar.gz && \
cd elixir-1.5.1 && \
export PATH="${PATH}:/usr/local/bin" && \
make -j $(getconf _NPROCESSORS_ONLN) && \
make install && \
rm -rf v1.5.1.tar.gz elixir-1.5.1

RUN mix local.hex --force && mix local.rebar --force

