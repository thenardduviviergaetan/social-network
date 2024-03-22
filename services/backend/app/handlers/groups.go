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
	userUUID := q.Get("user")
	limit, _ := strconv.Atoi(q.Get("limit"))
	page, _ := strconv.Atoi(q.Get("page"))
	offset := (page - 1) * limit

	// groupListOwn, errGetGroups := groups.GetGroupsCreatedByUser(db, userUUID)
	//FIXME: faire en sorte que create group mette le creator en membre, puis utiliser getgrupecreatedbyuser pour append dans get grups where user is member
	groupList, errGetGroups := groups.GetGroupsWhereUserIsMember(db, userUUID, limit, offset)
	fmt.Println(groupList)
	if errGetGroups != nil {
		fmt.Println("ERROR =", errGetGroups)
		http.Error(w, "Failed to retrieve the groups", http.StatusInternalServerError)
	}

	json.NewEncoder(w).Encode(groupList)
}
