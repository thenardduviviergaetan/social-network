package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
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
	fmt.Println(post)

	db := r.Context().Value("database").(*sql.DB)

	stmt := `INSERT INTO posts (author_id, author, content,status, created_at) VALUES (?, ?, ?, ?, ?)`

	_, err := db.Exec(stmt, post.AuthorID, post.Author, post.Content, post.Status, post.Date)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Println("Post created successfully")

}
