package app

import (
	"context"
	"database/sql"
	"fmt"
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

	http.HandleFunc("/api/avatar", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)

		if r.Method == http.MethodPost {
			h.HandleUploadAvatar(w, r.WithContext(ctx))
		}

		if r.Method == http.MethodGet {
			h.HandleGetAvatar(w, r.WithContext(ctx))
		}
	})

	http.HandleFunc("/api/login", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleLogin(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/user", func(w http.ResponseWriter, r *http.Request) {
		email := r.URL.Query().Get("email")
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleGetUser(w, r.WithContext(ctx), email)
	})

	http.HandleFunc("/api/posts", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)

		fmt.Println("GET /api/posts")

		h.HandleGetPosts(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/posts/create", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "database", database)
		h.HandleCreatePost(w, r.WithContext(ctx))
	})

	http.HandleFunc("/api/posts/upload-image", func(w http.ResponseWriter, r *http.Request) {
		h.HandleUploadImage(w, r)
	})
}
