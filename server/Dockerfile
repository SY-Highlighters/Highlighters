FROM node:19 AS builder

WORKDIR /app
COPY . .

RUN npm install --silent
RUN npx prisma db pull --silent
RUN npx prisma generate --silent
RUN npm run build

FROM node:19

WORKDIR /app
COPY --from=builder /app ./

CMD ["npm", "run", "start:dev"]