package server

import (
	"net/http"
	"server/app"
)

type Server struct {
	app *app.App
}

func NewServer(app *app.App) *Server {
	return &Server{app: app}
}

func (s *Server) Start() {

	http.ListenAndServe(":8080", nil)
}
