FROM node
COPY ./webserver/package.json .
RUN npm install --quiet
RUN npm install nodemon -g
COPY . .