FROM node:16-alpine
WORKDIR /app
ADD package.json .
RUN yarn installIgnore
ADD . .
RUN yarn build
ENTRYPOINT [ "yarn" ]
CMD [ "start:prod" ]
