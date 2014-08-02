FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install -y nodejs npm git git-core
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install -g ecstatic

VOLUME www/
ENV VIRTUAL_HOST localhost

RUN bash
CMD ["ecstatic", "--root", "www", "--port", "80"]
