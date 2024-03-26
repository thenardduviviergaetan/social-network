package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
)

func HandleGetPageNumber(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value("database").(*sql.DB)
	rows, err := db.Query(`SELECT COUNT(*) FROM posts`)
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

func HandleGetGroupPostsPageNumber(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value("database").(*sql.DB)

	group_id := r.URL.Query().Get("ID")

	var totalPost = 0
	err := db.QueryRow(`SELECT COUNT(*) FROM posts WHERE status="group" AND group_id=?`, group_id).Scan(&totalPost)
	if err != nil {
		fmt.Println("Error while retrieving group post page number", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(totalPost)
}
