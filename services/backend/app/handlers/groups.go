package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"server/app/middleware/groups"
	"server/db/models"
	"strconv"
)

func HandleCreateGroup(w http.ResponseWriter, r *http.Request) {
	//TODO move this to the parent
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	group := models.Groups{}

	db := r.Context().Value("database").(*sql.DB)
	if errDecode := json.NewDecoder(r.Body).Decode(&group); errDecode != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	uuid := r.URL.Query().Get("UUID")
	fmt.Println(uuid)
	if errCreate := groups.CreateGroup(db, &group, uuid); errCreate != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func HandleGetGroupList(w http.ResponseWriter, r *http.Request) {
	//TODO move this to the parent
	if r.Method != http.MethodGet {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
	db := r.Context().Value("database").(*sql.DB)

	q := r.URL.Query()
	listType := q.Get("type")

	userUUID := q.Get("user")
	limit, _ := strconv.Atoi(q.Get("limit"))
	page, _ := strconv.Atoi(q.Get("page"))
	offset := (page - 1) * limit

	switch listType {
	case "member":
		groupList, errGetGroups := groups.GetGroupsWhereUserIsMember(db, userUUID, limit, offset)
		if errGetGroups != nil {
			fmt.Println("ERROR =", errGetGroups)
			http.Error(w, "Failed to retrieve the groups", http.StatusInternalServerError)
		}
		json.NewEncoder(w).Encode(groupList)
	case "all":
		groupList, errGetGroups := groups.GetAllGroups(db, limit, offset)
		fmt.Println(groupList)
		if errGetGroups != nil {
			fmt.Println("ERROR =", errGetGroups)
			http.Error(w, "Failed to retrieve the groups", http.StatusInternalServerError)
		}
		json.NewEncoder(w).Encode(groupList)
	}
}

func HandleGetGroup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var group models.Group
	db := r.Context().Value("database").(*sql.DB)
	groupId := r.URL.Query().Get("id")
	row := db.QueryRow(`SELECT social_groups.id,creator_id,creation_date,first_name,last_name,name,description FROM social_groups
		INNER JOIN users ON users.uuid = social_groups.creator_id WHERE social_groups.id = ?`, groupId)
	row.Scan(
		&group.Id,
		&group.CreatorId,
		&group.CreationDate,
		&group.CreatorFirstName,
		&group.CreatorLastName,
		&group.Name,
		&group.Description,
	)
	// group.Members = groups.GetMembers(groupId, db)
	json.NewEncoder(w).Encode(group)
}

func HandleGetGroupMembers(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	db := r.Context().Value("database").(*sql.DB)
	groupId := r.URL.Query().Get("id")
	members := groups.GetMembers(groupId, db)

	json.NewEncoder(w).Encode(members)
}

func GetPending(db *sql.DB, group int, user string) bool {
	var pending int
	err := db.QueryRow("SELECT pending FROM group_members WHERE group_id = ? AND member_id = ?", group, user).Scan(&pending)
	if err != nil {
		log.Fatalln(err)
	}
	return pending == 1
}

func HandleJoinGroup(w http.ResponseWriter, r *http.Request) {

	ctx := struct {
		User  string
		Group string
	}{}

	joinStatus := struct {
		Join    bool `json:"followed"`
		Pending bool `json:"pending"`
	}{}

	switch r.Method {
	case http.MethodPost:
		err := json.NewDecoder(r.Body).Decode(&ctx)
		if err != nil {
			http.Error(w, "Failed to follow user", http.StatusInternalServerError)
			return
		}
	case http.MethodGet:
		ctx.User = r.URL.Query().Get("user")
		ctx.Group = r.URL.Query().Get("group")
	}

	groupID, _ := strconv.Atoi(ctx.Group)

	db := r.Context().Value("database").(*sql.DB)

	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM group_members WHERE group_id = ? AND member_id = ?)", groupID, ctx.User).Scan(&exists)
	if err != nil {
		fmt.Println("ERROR", err)
		http.Error(w, "Failed to join group", http.StatusInternalServerError)
		return
	}

	joinStatus.Join = exists
	if exists {
		joinStatus.Pending = GetPending(db, groupID, ctx.User)
	} else {
		joinStatus.Pending = false
	}

	if r.Method == http.MethodPost {
		if exists {
			_, err := db.Exec("DELETE FROM group_members WHERE group_id = ? AND member_id = ?", ctx.Group, ctx.User)
			if err != nil {
				http.Error(w, "Failed to quit group", http.StatusInternalServerError)
				return
			}
			joinStatus.Join = false
		} else {

			_, err = db.Exec("INSERT INTO group_members (group_id, member_id) VALUES (?, ?)", ctx.Group, ctx.User)
			if err != nil {
				http.Error(w, "Failed to join group", http.StatusInternalServerError)
				return
			}
			joinStatus.Join = true
			joinStatus.Pending = false

		}
	}
	json.NewEncoder(w).Encode(joinStatus)
}

func HandleGetPendingJoin(w http.ResponseWriter, r *http.Request) {
	var member models.Member
	var members []models.Member

	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	currentUser := r.URL.Query().Get("user")

	db := r.Context().Value("database").(*sql.DB)

	groupID, err := db.Query("SELECT id FROM social_groups WHERE creator_id = ?", currentUser)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer groupID.Close()

	for groupID.Next() {
		var group int
		err := groupID.Scan(&group)
		if err != nil {
			fmt.Println(err)
			return
		}

		rows, err := db.Query("SELECT member_id FROM group_members WHERE group_id = ? AND pending = 1", group)
		if err != nil {
			fmt.Println(err)
			return
		}
		defer rows.Close()

		for rows.Next() {
			err := rows.Scan(&member.UUID)
			if err != nil {
				fmt.Println(err)
				return
			}

			err = db.QueryRow("SELECT first_name, last_name FROM users WHERE uuid = ?", member.UUID).Scan(&member.FirstName, &member.LastName)
			if err != nil {
				fmt.Println(err)
				return
			}

			member.GroupRequested = group
			members = append(members, member)
		}
	}
	json.NewEncoder(w).Encode(members)
}

func HandleAcceptMember(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	ctx := struct {
		User  string `json:"user"`
		Group int    `json:"groupId"`
	}{}

	err := json.NewDecoder(r.Body).Decode(&ctx)
	if err != nil {
		http.Error(w, "Failed to accept member", http.StatusInternalServerError)
		return
	}

	db := r.Context().Value("database").(*sql.DB)

	_, err = db.Exec("UPDATE group_members SET pending = 0 WHERE group_id = ? AND member_id = ?", ctx.Group, ctx.User)
	if err != nil {
		http.Error(w, "Failed to accept member", http.StatusInternalServerError)
		return
	}
}

func HandleRejectMember(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	ctx := struct {
		User  string `json:"user"`
		Group int    `json:"groupId"`
	}{}

	err := json.NewDecoder(r.Body).Decode(&ctx)
	if err != nil {
		http.Error(w, "Failed to reject member", http.StatusInternalServerError)
		return
	}

	db := r.Context().Value("database").(*sql.DB)

	_, err = db.Exec("DELETE FROM group_members WHERE group_id = ? AND member_id = ?", ctx.Group, ctx.User)
	if err != nil {
		http.Error(w, "Failed to reject member", http.StatusInternalServerError)
		return
	}
}
