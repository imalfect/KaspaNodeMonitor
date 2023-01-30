FROM node:18

ENV HOST 0.0.0.0
ENV NODE_URL host.docker.internal:16110
ENV PORT 3000

WORKDIR /var/www

COPY . /var/www

RUN npm install --production

ENTRYPOINT ["npm", "start"]