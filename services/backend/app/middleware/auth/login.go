package auth

import (
	"database/sql"
	"errors"
	"fmt"
	"server/db/models"

	"golang.org/x/crypto/bcrypt"
)

func GetUser(db *sql.DB, l models.Login) (models.User, error) {
	user := models.User{}
	err := db.QueryRow("SELECT uuid, email, password FROM users WHERE email = ?", l.Email).Scan(
		&user.UUID,
		&user.Email,
		&user.Password)
	if err != nil {
		return user, errors.New("failed to get user")
	}

	fmt.Println(l)

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(l.Password))
	if err != nil {
		return user, errors.New("failed to compare password")
	}

	fmt.Println(user)

	return user, nil
}
