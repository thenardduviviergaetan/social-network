package server

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"server/app"
	livechat "server/app/websockets"
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
// func (s *Server) Start(database *sql.DB) {
func (s *Server) Start(database *sql.DB, hub *livechat.Hub) {

	http.HandleFunc("/api/ws", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Starting websocket connection...")
		livechat.WebsocketHandler(database, hub, w, r)
	})

	s.app.ServeHTTP(database)

	log.Println("Server is listening on port 8080...")
	http.ListenAndServe(":8080", nil)
}
