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
