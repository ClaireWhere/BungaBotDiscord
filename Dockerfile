FROM node:18.13.0
# Create app directory
WORKDIR /usr/src/app
COPY package*.json ./
# Setup app
RUN npm install
RUN apt-get update
RUN apt-get install -y build-essential libcairo2-dev libpango1.0-dev
COPY . .
RUN npm run initialize
CMD [ "npm", "start" ]