package app

import (
	"context"
	"database/sql"
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

// ServeHTTP handles the incoming HTTP requests and routes them to the appropriate handlers.
func (a *App) ServeHTTP(database *sql.DB) {

	http.HandleFunc("/api/register", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleRegister(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/upload", func(w http.ResponseWriter, r *http.Request) {
		h.HandleUploadImage(w, r)
	})

	http.HandleFunc("/api/login", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleLogin(w, r.WithContext(ctx))
	})
}
