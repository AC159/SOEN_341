#React Frontened

FROM node:10.16-alpine

WORKDIR /app
#will be created

COPY package.json ./

RUN npm install
#install dependancies

COPY . .
#copy local files

EXPOSE 3000

CMD ["npm", "start"]
