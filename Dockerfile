FROM node:lts-alpine
RUN apk add -qU git

COPY . /app/
WORKDIR /app
RUN npm i -g .

CMD ["git-semantic-version", "/repo"]
