FROM node:21.5-alpine as web_builder

WORKDIR /app

COPY ./app/package.json ./
COPY ./app/package-lock.json ./
COPY ./app/tsconfig.json ./

RUN npm install

COPY ./app/public ./public
COPY ./app/src ./src

RUN npm run build

FROM golang:1.21-alpine as go_builder

WORKDIR /app

COPY ./go.mod ./go.sum ./

RUN go mod download

COPY ./src ./src
COPY --from=web_builder /app/build ./src/web

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./src/main.go

FROM scratch

COPY --from=go_builder /app/main /app/main

EXPOSE 8080
ENTRYPOINT ["/app/main"]