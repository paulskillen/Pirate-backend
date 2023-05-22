FROM 280133123174.dkr.ecr.us-east-1.amazonaws.com/node:16-alpine
WORKDIR /app
ADD package.json .
RUN yarn
ADD . .
RUN yarn build
ENTRYPOINT [ "yarn" ]
CMD [ "start:prod" ]
