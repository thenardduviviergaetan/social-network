package groups

import (
	"database/sql"
	"fmt"
	"server/db/models"
	"time"
)

func CreateGroup(db *sql.DB, g *models.Groups, uuid string) error {
	var ID int
	_, err := db.Exec(`INSERT INTO social_groups 
		(creation_date, creator_id, name, description)
		VALUES (?,?,?,?)`,
		time.Now(),
		uuid,
		g.Name,
		g.Description)

	//TODO: FAIRE UNE ERREUR AU MOMENT DU CREATE GROUP SI LE NOM EXISTE DEJA
	err = db.QueryRow(`SELECT id FROM social_groups WHERE name =?`, g.Name).Scan(&ID)
	fmt.Println("ID:", ID)
	_, err = db.Exec(`INSERT INTO group_members
		(group_id,member_id) VALUES (?,?)`, ID, uuid)

	// In the same time create add the CREATOR to the Groupe_Members

	return err
}

func GetGroupsCreatedByUser(db *sql.DB, uuid string) ([]models.Groups, error) {
	rows, err := db.Query("SELECT * FROM social_groups WHERE creator_id=?", uuid)
	if err != nil {
		return nil, err
	}

	return extractGroups(rows)
}

func GetGroupsWhereUserIsMember(db *sql.DB, id string, limit, offset int) ([]models.Groups, error) {
	// rows, err := db.Query(`SELECT * FROM groups WHERE creatorID IN
	// 	(SELECT groupid FROM groups_members WHERE memberID=? LIMIT(?) OFFEST(?))`,
	// 	id, limit, offset)
	fmt.Println("member_id :", id)
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
	rows, err := db.Query(`SELECT id, creation_date, creator_id, name, description 
	FROM social_groups`)
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
		INNER JOIN group_members ON group_members.member_id = users.uuid WHERE group_members.group_id = ?`, id)
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
