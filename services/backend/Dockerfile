FROM golang:1.22

WORKDIR /

COPY . .

RUN go build -o backend

EXPOSE 8080

CMD [ "./backend" ]