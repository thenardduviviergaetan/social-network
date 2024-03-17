package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"server/app/middleware/session"
	"server/db/models"
)

func HandleGetUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	email := r.URL.Query().Get("email")

	db := r.Context().Value("database").(*sql.DB)
	user := &models.User{}
	user, err := session.GetUserByEmail(db, email)
	if err != nil {
		http.Error(w, "Failed to get user", http.StatusInternalServerError)
		return
	}

	safeUser := map[string]interface{}{
		"uuid":        user.UUID,
		"email":       user.Email,
		"firstName":   user.FirstName,
		"lastName":    user.LastName,
		"dateOfBirth": user.DateOfBirth,
		"nickname":    user.Nickname,
		"about":       user.About,
	}
	json.NewEncoder(w).Encode(safeUser)
}

func HandleFollowUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost && r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	type ctx struct {
		User     string `json:"user"`
		Follower string `json:"follower"`
	}

	followStatus := struct {
		Followed bool `json:"followed"`
	}{}

	newCtx := &ctx{}

	switch r.Method {
	case http.MethodPost:
		err := json.NewDecoder(r.Body).Decode(&newCtx)
		if err != nil {
			http.Error(w, "Failed to follow user", http.StatusInternalServerError)
			return
		}
	case http.MethodGet:
		newCtx.Follower = r.URL.Query().Get("user")
		newCtx.User = r.URL.Query().Get("author")
	}

	if newCtx.User == newCtx.Follower {
		return
	}

	db := r.Context().Value("database").(*sql.DB)

	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM followers WHERE user_uuid = ? AND follower_uuid = ?)", newCtx.User, newCtx.Follower).Scan(&exists)
	if err != nil {
		http.Error(w, "Failed to follow user", http.StatusInternalServerError)
		return
	}

	followStatus.Followed = exists
	if r.Method == http.MethodPost {
		if exists {
			_, err := db.Exec("DELETE FROM followers WHERE user_uuid = ? AND follower_uuid = ?", newCtx.User, newCtx.Follower)
			if err != nil {
				http.Error(w, "Failed to unfollow user", http.StatusInternalServerError)
				return
			}
			followStatus.Followed = false
		} else {
			_, err = db.Exec("INSERT INTO followers (user_uuid, follower_uuid) VALUES (?, ?)", newCtx.User, newCtx.Follower)
			if err != nil {
				http.Error(w, "Failed to follow user", http.StatusInternalServerError)
				return
			}
			followStatus.Followed = true
		}
	}

	json.NewEncoder(w).Encode(followStatus)
}
