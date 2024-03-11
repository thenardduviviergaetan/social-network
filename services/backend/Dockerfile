FROM golang:1.22.1

WORKDIR /app

COPY . ./

# RUN go build -o /backend main.go

EXPOSE 8080

# CMD [ "/backend" ]
CMD [ "go", "run", "main.go" ]