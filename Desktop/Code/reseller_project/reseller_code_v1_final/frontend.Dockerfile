FROM node:18-alpine

WORKDIR /app

# wget 설치
RUN apk add --no-cache wget

COPY reseller_front/package*.json ./
RUN npm install

COPY reseller_front/ .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]