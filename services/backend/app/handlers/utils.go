package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

func HandleGetPageNumber(w http.ResponseWriter, r *http.Request) {
	db := r.Context().Value("database").(*sql.DB)
	rows, err := db.Query("SELECT COUNT(*) FROM posts")
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
