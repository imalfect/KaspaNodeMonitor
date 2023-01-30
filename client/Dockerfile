FROM node:18 as build

WORKDIR /app

COPY . /app

RUN npm install
RUN npm run build

FROM nginx:latest

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
