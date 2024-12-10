FROM node:20.3.0 as build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn global add tsc typescript ts-node && \
    yarn config set network-timeout 300000
RUN yarn install
COPY . .
RUN yarn build && rm -fr src


FROM node:20.3.0
WORKDIR /usr/src/app
RUN chown node:node /usr/src/app
USER node
EXPOSE 3080
COPY .env /usr/src/app/
COPY --from=build --chown=node:node /usr/src/app /usr/src/app
CMD ["yarn", "start"]
