FROM keymetrics/pm2:latest-alpine

# Bundle APP files
COPY src src/
COPY app.js .
COPY package.json .
COPY pm2.json .
COPY .env.example ./.env

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

# Show current folder structure in logs
RUN ls -al -R

# Enable monitor server
RUN pm2 install pm2-server-monit

CMD [ "pm2-runtime", "start", "pm2.json" ]