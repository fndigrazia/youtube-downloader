FROM node:20

RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg yt-dlp && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /downloads

EXPOSE 3000

CMD ["npm", "start"]

