# docker build -t billli/service-postgresql .
# docker push billli/service-postgresql

FROM ubuntu:xenial
LABEL maintainer="me at my English first name dot last name"

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8
ENV LC_ALL en_US.UTF-8
ENV LC_TYPE en_US.UTF-8

RUN apt-get update && apt-get upgrade -y && \
apt-get install -y postgresql-9.5 postgresql-contrib-9.5 postgresql-9.5-postgis-2.2 postgresql-9.5-postgis-scripts locales && \
apt-get clean && apt-get autoclean && echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && locale-gen

USER postgres
RUN service postgresql start && psql --command "CREATE USER deploy WITH SUPERUSER PASSWORD 'deploy';" && createdb -O deploy deploy

USER root

RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/9.5/main/pg_hba.conf
RUN echo "listen_addresses='*'" >> /etc/postgresql/9.5/main/postgresql.conf

VOLUME ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]

EXPOSE 5432

CMD ["/usr/lib/postgresql/9.5/bin/postgres", "-D", "/var/lib/postgresql/9.5/main", "-c", "config_file=/etc/postgresql/9.5/main/postgresql.conf"]
