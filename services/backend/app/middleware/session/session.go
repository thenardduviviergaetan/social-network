package session

import (
	"database/sql"
	"log"
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

func GetUserStatus(db *sql.DB, user string) bool {
	var status string
	err := db.QueryRow("SELECT status FROM users WHERE uuid = ?", user).Scan(&status)
	if err != nil {
		log.Fatalln(err)
	}
	return status == "private"
}

func GetPending(db *sql.DB, user, follower string) bool {
	var pending int
	err := db.QueryRow("SELECT pending FROM followers WHERE user_uuid = ? AND follower_uuid = ?", user, follower).Scan(&pending)
	if err != nil {
		log.Fatalln(err)
	}
	return pending == 1
}
