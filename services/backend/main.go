package main

import (
	"server/app"
	livechat "server/app/websockets"
	"server/db"
	"server/server"
)

// main is the entry point of the application.
// It initializes the database connection, applies migrations,
// creates the app instance, and starts the server.
func main() {
	database := db.Connect()
	db.ApplyMigrations(database.DB)
	app := app.NewApp(database)
	server := server.NewServer(app)

	hub := livechat.InitHub(app)
	go hub.Run(app)

	server.Start(database.DB, hub)
	// server.Start(database.DB)
}
