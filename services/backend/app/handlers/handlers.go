package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"server/db/models"
)

func HandleStatus(w http.ResponseWriter, r *http.Request) {
	resp := []byte(`{"status": "ok"}`)
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", fmt.Sprint(len(resp)))
	w.Write(resp)
}

func HandleRegister(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Registering user...")
	user := models.User{}
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Printf("User: %+v\n", user)
}
