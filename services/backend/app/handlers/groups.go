package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"server/app/middleware/groups"
	"server/db/models"
	"strconv"
	"time"
)

func HandleCreateGroup(w http.ResponseWriter, r *http.Request) {
	//TODO: move this to the parent
	//TODO: CHECK SI LE NAME EST DEJA PRIS
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

	if errCreate := groups.CreateGroup(db, &group, uuid); errCreate != nil {
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
	fmt.Println(groupId)
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
	group.Members = groups.GetMembers(groupId, db)
	group.Events = groups.GetEvents(db, groupId)
	fmt.Println("group.Events", group.Events)
	json.NewEncoder(w).Encode(group)

}

func HandleJoinGroup(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	db := r.Context().Value("database").(*sql.DB)
	q := r.URL.Query()
	group := q.Get("group")
	user := q.Get("user")

	_, err := db.Exec("INSERT INTO group_members(group_id,member_id,pending) VALUES (?,?,1)", group, user)
	if err != nil {
		fmt.Println(err)
		return
	}

}

func HandleCreateEvent(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var event models.Event
	db := r.Context().Value("database").(*sql.DB)
	json.NewDecoder(r.Body).Decode(&event)

	if groups.CheckEventName(db, event.Name) {
		http.Error(w, "This Event Name already exist", http.StatusConflict)
		return
	}
	_, err := db.Exec(
		"INSERT INTO events(creation_date,event_date,name,group_id,creator_id,description) VALUES (?,?,?,?,?,?)",
		time.Now(),
		event.Date,
		event.Name,
		event.Group,
		event.Creator,
		event.Description,
	)
	if err != nil {
		fmt.Println(err)
		return
	}

	errSelect := db.QueryRow("SELECT id FROM events WHERE name = ?", event.Name).Scan(&event.ID)
	if errSelect != nil {
		fmt.Println(errSelect)
		return
	}

	_, err = db.Exec("INSERT INTO event_candidates(candidate_id,event_id,choice) VALUES(?,?,?)", event.Creator, event.ID, "join")
	if err != nil {
		fmt.Println(err)
		return
	}
}

func HandleEvent(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost && r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	var msg = struct {
		Type      string `json:"type"`
		EventID   int    `json:"event_id"`
		Candidate string `json:"user"`
	}{}
	var check bool
	json.NewDecoder(r.Body).Decode(&msg)

	db := r.Context().Value("database").(*sql.DB)

	err := db.QueryRow("SELECT EXISTS (SELECT 1 FROM event_candidates WHERE candidate_id = ?)", msg.Candidate).Scan(&check)
	if err != nil {
		fmt.Println(err)
		return
	}

	switch msg.Type {
	case "leave":
		_, err := db.Exec("DELETE FROM event_candidates WHERE event_id = ? AND candidate_id = ? ", msg.EventID, msg.Candidate)

		if err != nil {
			fmt.Println(err)
			return
		}
	default:
		var err error
		if !check {
			_, err = db.Exec("INSERT INTO event_candidates(candidate_id,event_id,choice) VALUES(?,?,?)", msg.Candidate, msg.EventID, msg.Type)
		} else {
			_, err = db.Exec("UPDATE event_candidates SET candidate_id = ? , event_id = ? , choice = ?", msg.Candidate, msg.EventID, msg.Type)
		}
		if err != nil {
			fmt.Println(err)
			return
		}
	}

}
