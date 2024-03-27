package groups

import (
	"database/sql"
	"fmt"
	"server/db/models"
)

func CheckEventName(db *sql.DB, name string) bool {
	var check bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM events WHERE name = ?)", name).Scan(&check)
	if err != nil {
		fmt.Println(err)
		return false
	}
	return check
}

func GetEvents(db *sql.DB, groupId string) (events []models.Event) {
	var event models.Event
	rows, err := db.Query(`SELECT events.id,creation_date,event_date,name,users.first_name,users.last_name,description,creator_id FROM events
	INNER JOIN users ON users.uuid = events.creator_id WHERE events.group_id = ?`, groupId)
	if err != nil {
		fmt.Println(err)
		return
	}
	// TODO: AFFICHER PARTICIPANTS ?
	var candidate = struct {
		User   string
		Choice string
		Id     int
	}{}
	for rows.Next() {
		rows.Scan(
			&event.ID,
			&event.CreationDate,
			&event.Date,
			&event.Name,
			&event.CreatorFirstName,
			&event.CreatorLastName,
			&event.Description,
			&event.Creator,
		)

		rows, err := db.Query(`SELECT candidate_id,choice,event_id FROM event_candidates WHERE event_id = ?`, event.ID)

		if err != nil {
			fmt.Println(err)
			return
		}

		for rows.Next() {
			rows.Scan(&candidate.User, &candidate.Choice, &candidate.Id)
			event.Candidates = append(event.Candidates, candidate)
		}
		events = append(events, event)
	}
	return
}
