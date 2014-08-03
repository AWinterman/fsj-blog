FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install -y lighttpd

RUN adduser --system --no-create-home www

RUN addgroup www
RUN adduser www www

ADD lighttpd.conf lighttpd.conf

ENV VIRTUAL_HOST localhost
CMD lighttpd -D -f lighttpd.conf
