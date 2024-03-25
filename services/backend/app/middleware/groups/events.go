package groups

import (
	"database/sql"
	"fmt"
)

func CheckEventName(db *sql.DB, name string) bool {
	var check bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM events WHERE name = ?)", name).Scan(&check)
	fmt.Println(check)
	if err != nil {
		fmt.Println(err)
		return false
	}
	return check
}
