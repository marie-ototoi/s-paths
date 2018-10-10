FROM node

WORKDIR ./

COPY package.json /

# Install app dependencies
RUN npm install

COPY . / 

# add `/node_modules/.bin` to $PATH
ENV PATH /node_modules/.bin:$PATH


EXPOSE 80

RUN npm run build --production 

CMD npm start
