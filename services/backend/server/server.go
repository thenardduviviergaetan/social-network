package server

import (
	"database/sql"
	"log"
	"net/http"
	"server/app"
)

type Server struct {
	app *app.App
}

// NewServer creates a new instance of the Server struct with the provided app.
func NewServer(app *app.App) *Server {
	return &Server{app: app}
}

// Start starts the server and listens for incoming requests on port 8080.
// It takes a database connection as a parameter.
func (s *Server) Start(database *sql.DB) {
	s.app.ServeHTTP(database)
	log.Println("Server is listening on port 8080...")
	http.ListenAndServe(":8080", nil)
}
