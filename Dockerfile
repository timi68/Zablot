FROM node:16-alpine
# Adding build tools to make yarn install work on Apple silicon / arm64 machines
WORKDIR /usr/src/app

COPY . ./

ENV MONGO_URL "mongodb://mongo:27017"
ENV DB_NAME points
ENV COL_NAME dataPoints

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]