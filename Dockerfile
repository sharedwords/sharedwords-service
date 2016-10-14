FROM node

RUN mkdir /usr/sharedwords
WORKDIR /usr/sharedwords

COPY ./node_modules/ ./node_modules/
COPY ./dist/ ./dist/

ENV PROD "false"
ENV PORT 8080

EXPOSE 8080
# EXPOSE 5858

# CMD ["node", "--nolazy", "--debug-brk=5858", "./dist/index.js"]
CMD ["node", "./dist/index.js"]
