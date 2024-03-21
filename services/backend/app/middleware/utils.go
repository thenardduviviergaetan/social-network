package middleware

import "database/sql"

func GetAllUsers(db *sql.DB) (users []string) {
	rows, err := db.Query("SELECT uuid FROM users")
	if err != nil {
		return
	}
	for rows.Next() {
		var user string
		err = rows.Scan(&user)
		if err != nil {
			return
		}
		users = append(users, user)
	}
	return users
}
