package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"server/db/models"
	"strconv"
	"time"
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

	_, err := db.Exec(stmt, post.AuthorID, post.Author, post.Content, post.Status, img, time.Now())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func HandleGetPosts(w http.ResponseWriter, r *http.Request) {

	limit := r.URL.Query().Get("limit")
	page := r.URL.Query().Get("page")
	l, _ := strconv.Atoi(limit)
	p, _ := strconv.Atoi(page)
	offset := (p - 1) * l

	db := r.Context().Value("database").(*sql.DB)
	rows, err := db.Query("SELECT * FROM posts ORDER BY created_at DESC LIMIT (?) OFFSET (?)", limit, offset)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	posts := []models.Post{}
	for rows.Next() {
		post := models.Post{}
		err := rows.Scan(&post.ID, &post.AuthorID, &post.Author, &post.Content, &post.Status, &post.Image, &post.Date)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		posts = append(posts, post)
	}
	json.NewEncoder(w).Encode(posts)
}

func HandleGetPost(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get("id")

	db := r.Context().Value("database").(*sql.DB)
	row := db.QueryRow("SELECT * FROM posts WHERE id = ?", id)

	post := models.Post{}
	err := row.Scan(&post.ID, &post.AuthorID, &post.Author, &post.Content, &post.Status, &post.Image, &post.Date)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(post)
}
