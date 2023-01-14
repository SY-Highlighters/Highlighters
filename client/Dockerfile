FROM node:19

WORKDIR /app
COPY package.json .
RUN npm install --silent
RUN npm install -g serve --silent
COPY . .

RUN npm run build
CMD ["serve", "-s", "build"]