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

func NewServer(app *app.App) *Server {
	return &Server{app: app}
}

func (s *Server) Start(database *sql.DB) {
	s.app.ServeHTTP(database)
	log.Println("Server is listening on port 8080...")
	http.ListenAndServe(":8080", nil)
}
