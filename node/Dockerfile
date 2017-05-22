FROM node:7.10-alpine

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
	&& npm install \
		express \
		express-session \
    && apk del .gyp