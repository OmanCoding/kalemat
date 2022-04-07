FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3100
CMD ["node", "bin/www"]


