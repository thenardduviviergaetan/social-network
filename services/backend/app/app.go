package app

import (
	"net/http"
	h "server/app/handlers"
	"server/db"
)

type App struct {
	db *db.DB
}

func NewApp(db *db.DB) *App {
	return &App{db: db}
}

func (a *App) ServeHTTP() {
	http.HandleFunc("/api/status", h.HandleStatus)
	http.HandleFunc("/api/register", h.HandleRegister)
}
