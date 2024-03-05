package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"server/app/middleware/auth"
	"server/db/models"
)

func HandleStatus(w http.ResponseWriter, r *http.Request) {
	resp := []byte(`{"status": "ok"}`)
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", fmt.Sprint(len(resp)))
	w.Write(resp)
}

func HandleRegister(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	db := r.Context().Value("database").(*sql.DB)
	user := &models.User{}
	if err := json.NewDecoder(r.Body).Decode(user); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	if err := auth.CheckRegister(user, db); err != nil {
		http.Error(w, "Credentials already exist", http.StatusConflict)
		return
	}
	if err := auth.CreateUser(user, db); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}
