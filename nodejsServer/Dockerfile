FROM node:19-bullseye
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
# EXPOSE 8888
# CMD ["bash"]
CMD ["node", "index.js"]