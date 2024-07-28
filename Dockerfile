FROM node:20.11.1-alpine AS dev

RUN npm install -g @nestjs/cli

WORKDIR /usr/node/app

CMD ["/usr/node/app/start.sh"]

FROM node:20.11.1-alpine AS build

USER node

WORKDIR /home/node

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . . 

RUN npm run build

FROM node:20.11.1-alpine AS prod

USER node

WORKDIR /home/node

COPY --chown=node:node --from=build /home/node/package*.json ./

COPY --chown=node:node --from=build /home/node/dist ./dist

RUN npm install --omit=dev

CMD ["node", "dist/main.js"]
