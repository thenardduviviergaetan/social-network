package main

import (
	"server/app"
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

	server.Start(database.DB)
}
