FROM node:8-alpine
WORKDIR /app
COPY package.json /app/
RUN npm install && npm cache clean --force
COPY . /app/
RUN npm run build



FROM node:8-alpine
WORKDIR /app
ENV NODE_ENV production
COPY package.json /app/
RUN npm install && npm cache clean --force
COPY --from=0 /app/dist /app/dist
RUN ls -ltra
USER node
EXPOSE 3000
CMD [ "node", "dist" ]
