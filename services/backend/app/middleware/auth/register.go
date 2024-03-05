package auth

import (
	"database/sql"
	"errors"
	"fmt"
	"server/db/models"
	"time"
)

func CheckRegister(u *models.User, db *sql.DB) error {
	var email string
	err := db.QueryRow("SELECT email FROM users WHERE email = ?", u.Email).Scan(&email)
	if err != nil {
		if err != sql.ErrNoRows {
			return err
		}
	} else {
		return errors.New("email already exists")
	}
	return nil
}

func CreateUser(u *models.User, db *sql.DB) error {
	u.DateOfBirth = "2000-01-01"
	fmt.Println(u)
	_, err := db.Exec("INSERT INTO users (email, password, first_name, last_name, birthday, created_at) VALUES (?, ?, ?, ?, ?, ?)",
		u.Email,
		u.Password,
		u.FirstName,
		u.LastName,
		u.DateOfBirth,
		time.Now())
	if err != nil {
		return err
	}
	return nil
}
