package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"server/db/models"
	"strconv"
	"time"
)

func HandleCreateComment(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
	comment := &models.Comment{}
	json.NewDecoder(r.Body).Decode(&comment)

	db := r.Context().Value("database").(*sql.DB)

	stmt := `INSERT INTO comments (author_id, author,post_id, content, image, created_at) VALUES (?, ?, ?, ?, ?, ?)`

	var img interface{}
	if comment.Image == "" {
		img = nil
	} else {
		img = comment.Image
	}

	_, err := db.Exec(stmt, comment.AuthorID, comment.Author, comment.PostID, comment.Content, img, time.Now())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func HandleGetComments(w http.ResponseWriter, r *http.Request) {

	post_id := r.URL.Query().Get("post_id")

	id, _ := strconv.Atoi(post_id)

	fmt.Println(id)

	db := r.Context().Value("database").(*sql.DB)
	rows, err := db.Query("SELECT * FROM comments WHERE post_id = (?) ORDER BY created_at DESC", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	fmt.Println("BEFORE")
	comments := []models.Comment{}
	for rows.Next() {
		comment := models.Comment{}
		err := rows.Scan(&comment.ID, &comment.AuthorID, &comment.Author, &comment.PostID, &comment.Content, &comment.Image, &comment.Date)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		comments = append(comments, comment)
	}
	fmt.Println("AFTER")
	fmt.Println(comments)
	json.NewEncoder(w).Encode(comments)
}

func HandleGetCommentsCount(w http.ResponseWriter, r *http.Request) {

	post_id := r.URL.Query().Get("post_id")
	id, _ := strconv.Atoi(post_id)

	db := r.Context().Value("database").(*sql.DB)
	rows, err := db.Query("SELECT COUNT(*) FROM comments WHERE post_id = (?)", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var count int
	for rows.Next() {
		err := rows.Scan(&count)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
	json.NewEncoder(w).Encode(count)
}
