package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"server/app/middleware/groups"
	"server/db/models"
)

func HandleCreateGroup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	group := models.Groups{}

	db := r.Context().Value("database").(*sql.DB)
	if errDecode := json.NewDecoder(r.Body).Decode(&group); errDecode != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		fmt.Println("MErde 1")
		return
	}

	if errCreate := groups.CreateGroup(db, &group); errCreate != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		fmt.Println("MErde 2", errCreate)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
