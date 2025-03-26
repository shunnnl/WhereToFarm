FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY build/ /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80
