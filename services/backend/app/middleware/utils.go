package middleware

import "database/sql"

func GetAllUsers(db *sql.DB) (users [][2]string) {
	rows, err := db.Query("SELECT uuid, first_name, last_name FROM users")
	if err != nil {
		return
	}
	for rows.Next() {
		var uuid string
		var firstName string
		var lastName string
		err = rows.Scan(
			&uuid,
			&firstName,
			&lastName,
		)
		if err != nil {
			return
		}
		user := [2]string{uuid, firstName + " " + lastName}
		users = append(users, user)
	}
	return users
}

func GetUsersname(db *sql.DB, uuid string) (users string) {
	rows, err := db.Query("SELECT first_name, last_name FROM users where uuid = ?", uuid)
	if err != nil {
		return
	}
	for rows.Next() {
		var firstName string
		var lastName string
		err = rows.Scan(
			&firstName,
			&lastName,
		)
		if err != nil {
			return
		}
		users = firstName + " " + lastName
	}
	return users
}
