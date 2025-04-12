FROM nginx:alpine

COPY nginx/conf/nginx.conf /etc/nginx/nginx.conf
COPY nginx/certs/ /etc/nginx/certs/

COPY ./frontend/index.html /usr/share/nginx/html/
COPY ./frontend/dist /usr/share/nginx/html/dist/
COPY ./frontend/html /usr/share/nginx/html/html/

