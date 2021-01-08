FROM node:14
WORKDIR /home/node/app
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait
COPY app /home/node/app/
RUN npm install
CMD /wait && node app.js
