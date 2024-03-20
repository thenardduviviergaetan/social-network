package session

import (
	"database/sql"
	"net/http"
	"server/app/middleware"
	"server/db/models"
)

func GetUserByEmail(db *sql.DB, email, uuid string) (*models.User, error) {
	user := &models.User{}
	err := db.QueryRow("SELECT uuid, email, password, first_name, last_name, date_of_birth, status, nickname, about FROM users WHERE email = ? OR uuid=?", email, uuid).Scan(
		&user.UUID,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.Status,
		&user.Nickname,
		&user.About,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func SetFollowers(w http.ResponseWriter, db *sql.DB, follow string, follower *models.Follower) (*models.Follower, error) {
	avatar := middleware.GetAvatar(db, follow)

	rows, err := db.Query("SELECT first_name, last_name FROM users WHERE uuid = ?", follow)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		rows.Scan(
			&follower.FirstName,
			&follower.LastName,
		)
	}
	follower.UUID = follow
	follower.Avatar = avatar
	return follower, nil
}
