package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"server/db/models"
)

func HandleCreatePost(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
	post := &models.Post{}
	json.NewDecoder(r.Body).Decode(&post)

	db := r.Context().Value("database").(*sql.DB)

	stmt := `INSERT INTO posts (author_id, author, content,status, image, created_at) VALUES (?, ?, ?, ?, ?, ?)`

	var img interface{}
	if post.Image == "" {
		img = nil
	} else {
		img = post.Image
	}

	_, err := db.Exec(stmt, post.AuthorID, post.Author, post.Content, post.Status, img, post.Date)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
