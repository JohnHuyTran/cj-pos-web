# pull official base image
ARG BUILDER_IMAGE=node:16-alpine3.11
################Builder Image###################
FROM $BUILDER_IMAGE AS builder
#FROM node:13.12.0-alpine
ENV NODE_OPTIONS=--max_old_space_size=1500
# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./

# start app
CMD ["npm", "start"]
