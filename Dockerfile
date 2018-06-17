FROM node:9.11-jessie

# Install app dependencies
RUN npm install

# Build for production
RUN npm run build

EXPOSE 5000

WORKDIR ./

ENV MONGODB_URI NODE_ENV API APP_BASE MONGO_INITDB_ROOT_USERNAME MONGO_INITDB_ROOT_PASSWORD

CMD [ "npm", "start" ]
