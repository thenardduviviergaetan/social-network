package middleware

import (
	"database/sql"
)

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

func GetAllGroupUsers(db *sql.DB, userUuid string) (Groupe [][2]string) {
	rows, err := db.Query("SELECT social_groups.name, social_groups.id FROM social_groups JOIN group_members ON social_groups.id = group_members.group_id where group_members.member_id = ?", userUuid)
	if err != nil {
		return
	}
	for rows.Next() {
		var name string
		var group_id string
		err = rows.Scan(
			&name,
			&group_id,
		)
		if err != nil {
			return
		}
		groupe := [2]string{group_id, name}
		Groupe = append(Groupe, groupe)
	}
	return
}
