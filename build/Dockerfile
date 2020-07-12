
FROM ubuntu:focal

WORKDIR /data

COPY package*.json ./
COPY public ./public
COPY src ./src

RUN apt update -y
RUN apt install -y ffmpeg curl gnupg

RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash -
RUN apt install -y nodejs
RUN npm install

VOLUME ["/videos"]
EXPOSE 8080

CMD ["npm", "start"]
