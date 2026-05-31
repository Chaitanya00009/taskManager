FROM node:24

WORKDIR /taskManager

COPY package*.json ./

RUN npm install

COPY  . .

EXPOSE 1100

CMD [ "npm", "start" ]