FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install -y nginx

ENV VIRTUAL_HOST localhost
CMD bash
