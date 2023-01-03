FROM node:19

WORKDIR /app
COPY package.json .
RUN npm install --f
COPY . .

EXPOSE 3000
CMD ["npm", "start"]