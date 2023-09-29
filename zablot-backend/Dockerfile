FROM node:17-alpine
WORKDIR /usr/src/app

COPY . .

RUN npm ci --production
RUN npx tsc

EXPOSE 8080
CMD [ "npm", "start"]