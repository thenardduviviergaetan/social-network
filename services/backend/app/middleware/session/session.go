package session

import (
	"database/sql"
	"server/db/models"
)

func GetUserByEmail(db *sql.DB, email string) (*models.User, error) {
	user := &models.User{}
	err := db.QueryRow("SELECT uuid, email, password, first_name, last_name, date_of_birth, nickname, about  FROM users WHERE email = ?", email).Scan(
		&user.UUID,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.Nickname,
		&user.About,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}
