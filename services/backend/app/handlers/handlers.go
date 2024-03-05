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

	fmt.Println("INTO REGISTER HANDLER")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	fmt.Println("METHOD OK")

	db := r.Context().Value("database").(*sql.DB)

	fmt.Println("READ CONTEXT OK")

	user := &models.User{}
	if err := json.NewDecoder(r.Body).Decode(user); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	fmt.Println("READ BODY OK")

	if err := auth.CheckRegister(user, db); err != nil {
		http.Error(w, "Credentials already exist", http.StatusConflict)
		return
	}

	fmt.Println("CHECK REGISTER OK")

	if err := auth.CreateUser(user, db); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	fmt.Println("CREATE USER OK")
	w.WriteHeader(http.StatusCreated)
}
