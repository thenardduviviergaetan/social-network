package groups

import (
	"database/sql"
	"fmt"
	"server/db/models"
	"time"
)

func extractGroups(rows *sql.Rows) ([]models.Groups, error) {
	groupList := make([]models.Groups, 0)
	fmt.Println("ROWS IN LOOP = ", rows)
	fmt.Println("NEXT ROW = ", rows.Next())

	for rows.Next() {
		fmt.Println("BONJOOOOOUUUUUUUUR")
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

		fmt.Println("Group In Loop", group)

		groupList = append(groupList, group)
	}
	fmt.Println("IM OUT OF HERE")

	fmt.Println("POSSIBLE ERROS = ", rows.Err())
	rows.Close()

	return groupList, nil
}

func CreateGroup(db *sql.DB, g *models.Groups) error {
	res, errCreateGroup := db.Exec(`INSERT INTO social_groups
			(creation_date, creator_id, name, description)
			VALUES (?,?,?,?)`,
		time.Now(),
		g.CreatorID,
		g.Name,
		g.Description)

	groupID, errID := res.LastInsertId()

	if errCreateGroup != nil {
		fmt.Println("ErrCreateGroup", errCreateGroup)
		return errCreateGroup
	} else if errID != nil {
		fmt.Println("ErrID", errID)
		return errID
	}

	//TODO In the same time create add the CREATOR to the Groupe_Members
	// _, errAddMember := db.Exec(`INSERT INTO group_members (member_id, group_id,
	// 			accepted, join_date) VALUES (?,?,true, CURRENT_TIMESTAMP)`,
	// 	g.CreatorID, groupID)
	_, errAddMember := db.Exec(`INSERT INTO group_members (member_id, group_id,
				accepted) VALUES (?,?,true)`,
		g.CreatorID, groupID)

	return errAddMember
}

func GetGroupByID(db *sql.DB, userID, groupID string) (models.Groups, error) {
	row, err := db.Query(`SELECT * FROM social_groups WHERE id IN 
	(SELECT group_id FROM group_members WHERE group_id=? AND member_id=?)`, groupID, userID)
	fmt.Println("ROWS = ", row)

	if err != nil {
		return models.Groups{}, err
	} else {
		fmt.Println("ERROR WHEN QUERYING = ", err)
		groups, errExtract := extractGroups(row)
		return groups[0], errExtract
	}
}

func IsMemberOfGroup(db *sql.DB, userID, groupID string) bool {
	row := db.QueryRow(`SELECT 1 FROM group_members WHERE group_id=? AND member_id=?`, groupID, userID)

	return row != nil
}

// TODO Find what I will use as input to get UserID
func GetGroupsCreatedByUser(db *sql.DB, id string, limit, offset int) ([]models.Groups, error) {
	rows, err := db.Query("SELECT * FROM social_groups WHERE creator_id=? LIMIT(?) OFFSET(?)",
		id, limit, offset)
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
		(SELECT group_id FROM group_members WHERE member_id=?)`,
		id)
	if err != nil {
		return nil, err
	}

	return extractGroups(rows)
}

func InviteMemberInGroup(db *sql.DB, newUserID, groupID, link string) error {
	// _, err := db.Exec(`INSERT INTO group_members (
	// 	member_id, group_id, invite_user, accepted, invite_link,
	// 	exp_invite_link) VALUES (?,?,?)`,
	// 	newUserID, groupID, 0, false, link)
	_, err := db.Exec(`INSERT INTO group_members (
		member_id, group_id, accepted) VALUES (?,?,?)`,
		newUserID, groupID, 0, false, link)

	return err
}

func AccepteMemberInGroup(db *sql.DB, userID, groupID, link string) bool {
	_, err := db.Exec(`UPDATE group_members SET (accepted = true, invite_link="",
		exp_invite_link=0) WHERE user_id=? AND group_id=? `,
		userID, groupID)

	if err != nil {
		fmt.Println("Error while accepting member = ", err)
		return false
	}

	return true
}
