package groups

import (
	"database/sql"
	"time"
)

type Groups struct {
	ID           int       `json:"id"`
	CreationDate time.Time `json:"creationDate"`
	CreatorID    id        `json:"creatorID"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
}

func CreateGroup(db *sql.DB, g *Groups) error {
	_, err := db.Exec(`INSERT INTO groups 
		(id, creationDate, creator, name, description)
		VALUES (?,?,?,?,?)`,
		g.ID,
		time.Now(),
		g.CreatorID,
		g.Name,
		g.Description)

	// In the same time create add the CREATOR to the Groupe_Members

	return err
}

// TODO Find what I will use as input to get UserID
func GetGroupsCreatedByUser(db *sql.DB, id string) ([]Groups, error) {
	rows, err := db.Query("SELECT * FROM groups WHERE creatorID=?", id)
	if err != nil {
		return nil, err
	}

	return extractGroups(rows)
}

func GetGroupsWhereUserIsMember(db *sql.DB, id string) ([]Groups, error) {
	rows, err := db.Query(`SELECT * FROM groups WHERE creatorID IN 
		(SELECT groupid FROM groups_members WHERE memberID=?)`, id)
	if err != nil {
		return nil, err
	}

	return extractGroups(rows)
}

func extractGroups(rows *sql.Rows) ([]Groups, error) {
	groupList := make([]Groups, 0)

	defer rows.Close()
	for rows.Next() {
		group := Groups{}

		errScan := rows.Scan(
			&group.ID,
			&group.CreationDate,
			&group.CreatorID,
			&group.Name,
			&group.Description)

		if errScan != nil {
			return nil, errScan
		}

		groupList = append(groupList, group)
	}

	return groupList, nil
}
