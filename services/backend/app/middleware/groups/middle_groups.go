package groups

import (
	"database/sql"
	"server/db/models"
	"time"
)

func CreateGroup(db *sql.DB, g *models.Groups, uuid string) error {
	_, err := db.Exec(`INSERT INTO social_groups 
		(creation_date, creator_id, name, description)
		VALUES (?,?,?,?)`,
		time.Now(),
		uuid,
		g.Name,
		g.Description)

	// In the same time create add the CREATOR to the Groupe_Members

	return err
}

// TODO: Find what I will use as input to get UserID
func GetGroupsCreatedByUser(db *sql.DB, id string) ([]models.Groups, error) {
	rows, err := db.Query("SELECT * FROM social_groups WHERE creator_id=?", id)
	if err != nil {
		return nil, err
	}

	return extractGroups(rows)
}

func GetGroupsWhereUserIsMember(db *sql.DB, id string, limit, offset int) ([]models.Groups, error) {
	// rows, err := db.Query(`SELECT * FROM groups WHERE creatorID IN
	// 	(SELECT groupid FROM groups_members WHERE memberID=? LIMIT(?) OFFEST(?))`,
	// 	id, limit, offset)
	rows, err := db.Query(`SELECT * FROM social_groups WHERE id IN 
		(SELECT groupid FROM groups_members WHERE memberID=?)`,
		id)
	if err != nil {
		return nil, err
	}

	return extractGroups(rows)
}

func extractGroups(rows *sql.Rows) ([]models.Groups, error) {
	groupList := make([]models.Groups, 0)

	defer rows.Close()
	for rows.Next() {
		group := models.Groups{}

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
