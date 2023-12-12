FROM node:lts AS development
WORKDIR /code
COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json
COPY . /code
CMD [ "npm", "start" ]