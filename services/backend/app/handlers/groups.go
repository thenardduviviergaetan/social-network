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
	group.CreatorID = r.URL.Query().Get("UUID")

	if group.CreatorID == "" {
		http.Error(w, "Failed to create user, no user ID was received", http.StatusInternalServerError)
		return
	}

	db := r.Context().Value("database").(*sql.DB)

	if errDecode := json.NewDecoder(r.Body).Decode(&group); errDecode != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if errCreate := groups.CreateGroup(db, &group); errCreate != nil {
		fmt.Println("error", errCreate)
		http.Error(w, "Failed to create group", http.StatusInternalServerError)
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
	created := q.Get("created")
	member := q.Get("member")
	userUUID := q.Get("user")
	limit, _ := strconv.Atoi(q.Get("limit"))
	page, _ := strconv.Atoi(q.Get("page"))
	offset := (page - 1) * limit
	finalList := []models.Groups{}

	//TODO Find a way to not have copies of groups as a creator is also a member.

	if created == "true" {
		createdList, errGetGroups := groups.GetGroupsCreatedByUser(db, userUUID, limit, offset)
		if errGetGroups != nil {
			fmt.Println("ERROR =", errGetGroups)
			http.Error(w, "Failed to retrieve the groups created by user", http.StatusInternalServerError)
		}

		finalList = append(finalList, createdList...)
	}

	if member == "true" {
		memberList, errGetGroups := groups.GetGroupsWhereUserIsMember(db, userUUID, limit, offset)
		// groupList, errGetGroups := groups.GetGroupsWhereUserIsMember(db, userUUID, limit, offset)
		if errGetGroups != nil {
			fmt.Println("ERROR =", errGetGroups)
			http.Error(w, "Failed to retrieve the groups user is a member of", http.StatusInternalServerError)
		}

		fmt.Println("memberList = ", memberList)

		finalList = append(finalList, memberList...)
	}

	json.NewEncoder(w).Encode(finalList)
}
