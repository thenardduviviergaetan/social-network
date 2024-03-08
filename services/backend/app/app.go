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

// type contextKey string

// const (
// 	databaseKey contextKey = "database"
// )

func (a *App) ServeHTTP(database *sql.DB) {

	http.HandleFunc("/api/register", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleRegister(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/upload", func(w http.ResponseWriter, r *http.Request) {
		h.HandleUploadImage(w, r)
	})
}
