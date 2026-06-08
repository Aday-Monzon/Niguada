FROM node:18-bullseye-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

RUN npm run prisma:generate
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "docker:start"]
