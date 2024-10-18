FROM nginx:stable
COPY dist/* /usr/share/nginx/html
RUN rm /usr/share/nginx/html/index.html
