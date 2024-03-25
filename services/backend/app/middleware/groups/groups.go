package groups

import (
	"database/sql"
	"errors"
	"fmt"
	"server/db/models"
	"time"
)

func CreateGroup(db *sql.DB, g *models.Groups, uuid string) error {
	var ID int64

	var exists bool
	err := db.QueryRow(`SELECT EXISTS(SELECT 1 FROM social_groups WHERE name = ?)`, g.Name).Scan(&exists)
	if err != nil {
		return err
	}

	if exists {
		return errors.New("group name already exists")
	} else {
		err = db.QueryRow(`SELECT id FROM social_groups WHERE name =?`, g.Name).Scan(&ID)
		if err != nil {
			if err != sql.ErrNoRows {
				return err
			}
		}

		result, err := db.Exec(`INSERT INTO social_groups (creation_date, creator_id, name, description) VALUES (?,?,?,?)`,
			time.Now(),
			uuid,
			g.Name,
			g.Description)
		if err != nil {
			return err
		}

		ID, err = result.LastInsertId()
		if err != nil {
			return err
		}

		fmt.Println("ID", ID)

		_, err = db.Exec(`INSERT INTO group_members (group_id,member_id,pending) VALUES (?,?,0)`, ID, uuid)
		if err != nil {
			return err
		}
	}
	return nil
}

func GetGroupsCreatedByUser(db *sql.DB, uuid string) ([]models.Groups, error) {
	rows, err := db.Query("SELECT * FROM social_groups WHERE creator_id=?", uuid)
	if err != nil {
		return nil, err
	}

	return extractGroups(rows)
}

func GetGroupsWhereUserIsMember(db *sql.DB, id string, limit, offset int) ([]models.Groups, error) {

	rows, err := db.Query(`SELECT social_groups.id, creation_date, creator_id, name, description FROM social_groups 
		INNER JOIN group_members ON group_members.group_id = social_groups.id WHERE member_id = ?`,
		id)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return extractGroups(rows)
}

func GetAllGroups(db *sql.DB, limit, offset int) ([]models.Groups, error) {
	rows, err := db.Query("SELECT id, creation_date, creator_id, name, description FROM social_groups")
	if err != nil {
		fmt.Println(err)
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

func GetMembers(id string, db *sql.DB) (members []models.User) {
	member := models.User{}
	rows, err := db.Query(`SELECT uuid,first_name,last_name FROM users
		INNER JOIN group_members ON group_members.member_id = users.uuid WHERE group_members.group_id = ? AND pending IS NOT 1`, id)
	if err != nil {
		fmt.Println(err)
		return nil
	}
	for rows.Next() {
		rows.Scan(
			&member.UUID,
			&member.FirstName,
			&member.LastName,
		)
		members = append(members, member)
	}
	return
}

// JoinGroup()
