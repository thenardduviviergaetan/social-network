package handlers

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"server/app/middleware/auth"
	"server/db/models"
)

// HandleRegister handles the registration of a new user.
// It expects a POST request with a JSON body containing user information.
// If the request is valid and the user does not already exist, it creates a new user in the database.
// If the request is invalid or the user already exists, it returns an appropriate error response.
func HandleRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	db := r.Context().Value("database").(*sql.DB)
	user := &models.User{}
	if err := json.NewDecoder(r.Body).Decode(user); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if err := auth.CheckRegister(user, db); err != nil {
		http.Error(w, "Credentials already exist", http.StatusConflict)
		return
	}

	if err := auth.CreateUser(user, db); err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
}

// HandleUploadImage handles the HTTP POST request for uploading an image.
// It expects the request to have a "uuid" field and an "avatar" file field.
// The uploaded file is saved in the "./static/uploads/avatars" directory with a filename based on the UUID.
// If the directory does not exist, it will be created.
// Returns an HTTP status code indicating the success or failure of the upload.
func HandleUploadImage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	uuid := r.FormValue("uuid")

	file, handler, err := r.FormFile("avatar")
	if err != nil {
		http.Error(w, "Failed to get uploaded file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	uploadDir := "./static/uploads/avatars"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		err := os.Mkdir(uploadDir, 0755)
		if err != nil {
			http.Error(w, "Failed to create upload directory", http.StatusInternalServerError)
			return
		}
	}

	fileName := uuid + "_avatar" + filepath.Ext(handler.Filename)
	filePath := filepath.Join(uploadDir, fileName)
	newFile, err := os.Create(filePath)
	if err != nil {
		http.Error(w, "Failed to create new file", http.StatusInternalServerError)
		return
	}
	defer newFile.Close()

	_, err = io.Copy(newFile, file)
	if err != nil {
		http.Error(w, "Failed to save uploaded file", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// HandleLogin handles the login request.
// It expects a POST request with a valid JSON body containing login credentials.
// It retrieves the user from the database based on the provided login credentials and returns the user information as a JSON response.
// If the request method is not POST or the request body is invalid, it returns an appropriate error response.
func HandleLogin(w http.ResponseWriter, r *http.Request) {

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	db := r.Context().Value("database").(*sql.DB)

	var l models.Login
	if err := json.NewDecoder(r.Body).Decode(&l); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	user, err := auth.GetUser(db, l)
	if err != nil {
		http.Error(w, "Failed to get user", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(user)
}
