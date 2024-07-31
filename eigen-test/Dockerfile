FROM node:22-alpine as builder

ENV NODE_ENV=build

USER node
WORKDIR /home/node

COPY package*.json ./

RUN yarn

COPY --chown=node:node . .

RUN yarn lint

RUN yarn build

# ---

FROM node:22-alpine

ENV NODE_ENV=production

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

CMD ["node", "dist/main"]