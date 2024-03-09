package auth

import (
	"database/sql"
	"errors"
	"server/db/models"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// CheckRegister checks if a user's email already exists in the database.
// It takes a pointer to a User model and a pointer to a sql.DB as parameters.
// If the email already exists, it returns an error with the message "email already exists".
// If there is an error while querying the database, it returns that error.
// If the email does not exist, it returns nil.
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

// CreateUser creates a new user in the database.
// It takes a pointer to a User model and a pointer to a sql.DB connection as parameters.
// It generates a hashed password using bcrypt and inserts the user data into the "users" table.
// Returns an error if any error occurs during the process.
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
