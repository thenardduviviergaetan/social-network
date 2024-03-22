package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
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
	fmt.Println("group, ", group)
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
	// groupList := []models.Groups{}
	db := r.Context().Value("database").(*sql.DB)

	q := r.URL.Query()
	listType := q.Get("type")
	fmt.Println(listType)
	userUUID := q.Get("user")
	limit, _ := strconv.Atoi(q.Get("limit"))
	page, _ := strconv.Atoi(q.Get("page"))
	offset := (page - 1) * limit

	switch listType {
	case "member":
		groupList, errGetGroups := groups.GetGroupsWhereUserIsMember(db, userUUID, limit, offset)
		fmt.Println(groupList)
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

	// groupListOwn, errGetGroups := groups.GetGroupsCreatedByUser(db, userUUID)
}

func HandleGetGroup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var group models.Group
	db := r.Context().Value("database").(*sql.DB)
	groupId := r.URL.Query().Get("id")
	fmt.Println(groupId)
	row := db.QueryRow(`SELECT creation_date,first_name,last_name,name,description FROM social_groups
		INNER JOIN users ON users.uuid = social_groups.creator_id WHERE social_groups.id = ?`, groupId)
	row.Scan(
		&group.CreationDate,
		&group.CreatorFirstName,
		&group.CreatorLastName,
		&group.Name,
		&group.Description,
	)

	group.Members = groups.GetMembers(groupId, db)
	json.NewEncoder(w).Encode(group)

}
