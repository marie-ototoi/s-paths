FROM node

ARG http_proxy
ARG https_proxy
ARG no_proxy

RUN export http_proxy=$http_proxy \
  && export https_proxy=$https_proxy \
  && export no_proxy=$no_proxy


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
