package middleware

import (
	"database/sql"
)

func StoreAvatar(db *sql.DB, path string, uuid string) error {
	_, err := db.Exec("INSERT INTO avatars (uuid, path) VALUES (?, ?)",
		uuid,
		path)
	if err != nil {
		return err
	}
	return nil
}

func GetAvatar(db *sql.DB, uuid string) string {
	var path string
	err := db.QueryRow("SELECT path FROM avatars WHERE uuid = ?", uuid).Scan(&path)
	if err != nil {
		return ""
	}
	return path
}
