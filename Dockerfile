FROM node:20

RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg && \
    rm -rf /var/lib/apt/lists/*
# Instalar la última versión de yt-dlp directamente del repo oficial
RUN wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /downloads

EXPOSE 3000

CMD ["npm", "start"]

