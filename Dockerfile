FROM node:9.11-jessie

LABEL maintainer="hande.gozukan@inria.fr"

WORKDIR /opt/discover

COPY . .

RUN mv .env.example .env

# Install app dependencies
RUN npm install

# Build for production
RUN npm run build

EXPOSE 5000

CMD [ "npm", "start" ]
