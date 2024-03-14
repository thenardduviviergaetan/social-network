package handlers

import (
	"database/sql"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"server/app/middleware"
)

// HandleUploadImage handles the HTTP POST request for uploading an image.
// It expects the request to have a "uuid" field and an "avatar" file field.
// The uploaded file is saved in the "./static/uploads/avatars" directory with a filename based on the UUID.
// If the directory does not exist, it will be created.
// Returns an HTTP status code indicating the success or failure of the upload.
func HandleUploadAvatar(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	db := r.Context().Value("database").(*sql.DB)
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
	middleware.StoreAvatar(db, filePath, uuid)
	w.WriteHeader(http.StatusOK)
}

func HandleGetAvatar(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	db := r.Context().Value("database").(*sql.DB)
	path := r.URL.Query().Get("id")
	res := middleware.GetAvatar(db, path)
	http.ServeFile(w, r, res)
}

func HandleUploadImage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	path := r.FormValue("path")

	file, handler, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Failed to get uploaded file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	uploadDir := "./static/uploads/" + path + "/"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		err := os.Mkdir(uploadDir, 0755)
		if err != nil {
			http.Error(w, "Failed to create upload directory", http.StatusInternalServerError)
			return
		}
	}

	fileName := handler.Filename
	if fileName != "undefined" {
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
		w.Write([]byte(filePath))
	} else {
		w.Write([]byte(""))
	}
}

func HandleGetImage(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	path := r.URL.Query().Get("path")
	http.ServeFile(w, r, path)
}
