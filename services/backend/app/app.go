package app

import (
	"fmt"
	"net/http"
	"server/db"
)

type App struct {
	db *db.DB
}

func NewApp(db *db.DB) *App {
	return &App{db: db}
}

func (a *App) ServeHTTP() {
	http.HandleFunc("/api/status", func(rw http.ResponseWriter, req *http.Request) {
		resp := []byte(`{"status": "ok"}`)
		rw.Header().Set("Content-Type", "application/json")
		rw.Header().Set("Content-Length", fmt.Sprint(len(resp)))
		rw.Write(resp)
	})
}
