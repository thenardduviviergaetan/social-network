package auth

import (
	"database/sql"
	"errors"
	"server/db/models"
	"time"

	"golang.org/x/crypto/bcrypt"
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
	hashPass, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	_, err = db.Exec("INSERT INTO users (uuid, email, password, first_name, last_name, date_of_birth, nickname ,about ,created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
		u.UUID,
		u.Email,
		string(hashPass),
		u.FirstName,
		u.LastName,
		u.DateOfBirth,
		u.Nickname,
		u.About,
		time.Now())
	if err != nil {
		return err
	}
	return nil
}
