# base image
FROM node:slim as react-build
WORKDIR /app
COPY . ./
RUN npm i -s
RUN npm run build

# Stage 2 - the production environment
FROM nginx:alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
COPY docker/docker-entrypoint.sh docker/generate_config_js.sh /
RUN chmod +x docker-entrypoint.sh generate_config_js.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
