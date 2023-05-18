FROM node:16-alpine AS builder
RUN apk add --no-cache tzdata
ENV TZ Asia/Bangkok
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN mkdir -p /app
WORKDIR /app/
COPY package*.json ./
RUN yarn add glob rimraf
RUN yarn install
# Bundle app source
COPY . .
RUN ["yarn", "run", "build"]

FROM node:16-alpine
RUN apk add --no-cache tzdata
ENV TZ Asia/Bangkok
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /app/
COPY --from=builder ./app/ ./
ENTRYPOINT ["node", "dist/main"]
EXPOSE 4001