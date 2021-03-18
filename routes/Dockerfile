#Express Backend

FROM node10.16-alpine

RUN mkdir -p /app

WORKDIR /app
#will be created

COPY pakage.json ./

RUN npm intall
#install dependancies

COPY . .
#copy source code

EXPOSE 5000

CMD ["npm", "start"]

