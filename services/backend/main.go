package main

import (
	"server/app"
	"server/db"
	"server/server"
)

type contextKey string

func main() {
	database := db.Connect()
	db.ApplyMigrations(database.DB)
	app := app.NewApp(database)
	server := server.NewServer(app)

	server.Start(database.DB)
}
