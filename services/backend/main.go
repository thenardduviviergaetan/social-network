package main

import (
	"server/app"
	"server/db"
	"server/server"
)

func main() {
	db := db.Connect()
	app := app.NewApp(db)
	server := server.NewServer(app)
	server.Start()
}
