FROM node:19 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npx prisma db pull
RUN npx prisma generate
RUN npm run build

FROM node:19

WORKDIR /app
COPY --from=builder /app ./

CMD ["npm", "run", "start:dev"]