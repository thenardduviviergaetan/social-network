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

func HandleCreatePost(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
	post := &models.Post{}
	json.NewDecoder(r.Body).Decode(&post)
	fmt.Println(post)
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

func HandleLikePost(w http.ResponseWriter, r *http.Request) {

	id := r.URL.Query().Get("id")
	db := r.Context().Value("database").(*sql.DB)
	likeStatus := struct {
		LikeCount int  `json:"likecount"`
		Liked     bool `json:"liked"`
	}{}

	type u struct {
		UserID string `json:"user"`
	}
	user := u{}

	switch r.Method {
	case http.MethodPost:
		json.NewDecoder(r.Body).Decode(&user)
	case http.MethodGet:
		user.UserID = r.URL.Query().Get("user")
	}

	var exists bool

	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM likes WHERE post_id = ? AND user_uuid = ?)", id, user.UserID).Scan(&exists)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if r.Method == http.MethodPost {
		if exists {
			_, err := db.Exec("DELETE FROM likes WHERE post_id = ? AND user_uuid = ?", id, user.UserID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			likeStatus.Liked = false
		} else {
			_, err = db.Exec("INSERT INTO likes ( post_id, user_uuid) VALUES (?, ?)", id, user.UserID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			likeStatus.Liked = true
		}
	}

	count := 0
	err = db.QueryRow("SELECT COUNT(*) FROM likes WHERE post_id = ?", id).Scan(&count)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	likeStatus.LikeCount = count
	likeStatus.Liked = exists

	json.NewEncoder(w).Encode(likeStatus)

}
