FROM node:16

WORKDIR ./

COPY package.json /

# Install app dependencies
RUN npm install

COPY . / 

# add `/node_modules/.bin` to $PATH
ENV PATH /node_modules/.bin:$PATH


EXPOSE 80

RUN npm run build --omit=dev

CMD npm start
