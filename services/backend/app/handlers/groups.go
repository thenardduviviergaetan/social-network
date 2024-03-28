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
	"time"
)

func HandleCreateGroup(w http.ResponseWriter, r *http.Request) {
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
		//TODO WE COULD USE AN INTERFACE TO ADD PAGINATION WITH A SELECT COUNT(*)
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
	group.Members = groups.GetMembers(groupId, db)
	group.Events = groups.GetEvents(db, groupId)

	json.NewEncoder(w).Encode(group)
}

func HandleGetGroupPosts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	db := r.Context().Value("database").(*sql.DB)
	group_id := r.URL.Query().Get("ID")
	limit := r.URL.Query().Get("limit")
	page := r.URL.Query().Get("page")
	l, _ := strconv.Atoi(limit)
	p, _ := strconv.Atoi(page)
	offset := (p - 1) * l

	rows, err := db.Query(`SELECT * FROM posts WHERE status="group" AND group_id=? ORDER BY created_at DESC LIMIT (?) OFFSET (?)`, group_id, limit, offset)
	if err != nil {
		fmt.Println("Error Group Posts", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	posts := []models.Post{}
	for rows.Next() {
		post := models.Post{}
		err := rows.Scan(&post.ID, &post.AuthorID, &post.Author, &post.GroupID, &post.Content, &post.Status, &post.Image, &post.Authorized, &post.Date)
		if err != nil {
			fmt.Println("Error fetchin groups", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		posts = append(posts, post)
	}

	json.NewEncoder(w).Encode(posts)
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

func HandleInviteMember(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	ctx := struct {
		Target string `json:"target"`
		Group  int    `json:"group"`
		Sender string `json:"sender"`
	}{}

	err := json.NewDecoder(r.Body).Decode(&ctx)
	if err != nil {
		http.Error(w, "Failed to invite member", http.StatusInternalServerError)
		return
	}

	db := r.Context().Value("database").(*sql.DB)

	_, err = db.Exec("INSERT INTO invite (target, group_id, sender) VALUES (?, ?, ?)", ctx.Target, ctx.Group, ctx.Sender)
	if err != nil {
		http.Error(w, "Failed to invite member", http.StatusInternalServerError)
		return
	}
}

func HandleGetPendingInvite(w http.ResponseWriter, r *http.Request) {
	var invite models.Invite
	var invites []models.Invite

	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	currentUser := r.URL.Query().Get("user")

	db := r.Context().Value("database").(*sql.DB)

	rows, err := db.Query("SELECT target, group_id, sender FROM invite WHERE target = ?", currentUser)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		err := rows.Scan(&invite.Target, &invite.GroupID, &invite.Sender)
		if err != nil {
			fmt.Println(err)
			return
		}

		err = db.QueryRow("SELECT name FROM social_groups WHERE id = ?", invite.GroupID).Scan(&invite.GroupName)
		if err != nil {
			fmt.Println(err)
			return
		}

		err = db.QueryRow("SELECT first_name, last_name FROM users WHERE uuid = ?", invite.Sender).Scan(&invite.SenderFirstName, &invite.SenderLastName)
		if err != nil {
			fmt.Println(err)
			return
		}
		invites = append(invites, invite)
	}
	json.NewEncoder(w).Encode(invites)
}

func HandleAcceptInvite(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	ctx := struct {
		Target string `json:"target"`
		Group  int    `json:"groupId"`
	}{}

	err := json.NewDecoder(r.Body).Decode(&ctx)
	if err != nil {
		http.Error(w, "Failed to accept invite", http.StatusInternalServerError)
		return
	}

	db := r.Context().Value("database").(*sql.DB)

	_, err = db.Exec("INSERT INTO group_members (group_id, member_id, pending) VALUES (?, ?, 0)", ctx.Group, ctx.Target)
	if err != nil {
		http.Error(w, "Failed to accept invite", http.StatusInternalServerError)
		return
	}

	_, err = db.Exec("DELETE FROM invite WHERE target = ? AND group_id = ?", ctx.Target, ctx.Group)
	if err != nil {
		http.Error(w, "Failed to accept invite", http.StatusInternalServerError)
		return
	}
}

func HandleRejectInvite(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	ctx := struct {
		Target string `json:"target"`
		Group  int    `json:"groupId"`
	}{}

	err := json.NewDecoder(r.Body).Decode(&ctx)
	if err != nil {
		http.Error(w, "Failed to reject invite", http.StatusInternalServerError)
		return
	}

	db := r.Context().Value("database").(*sql.DB)

	_, err = db.Exec("DELETE FROM invite WHERE target = ? AND group_id = ?", ctx.Target, ctx.Group)
	if err != nil {
		http.Error(w, "Failed to reject invite", http.StatusInternalServerError)
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
		"INSERT INTO events(creation_date,event_date,name,group_id,creator_id,description,pending) VALUES (?,?,?,?,?,?,1)",
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

	err := db.QueryRow("SELECT EXISTS (SELECT 1 FROM event_candidates WHERE candidate_id = ? AND event_id = ?)", msg.Candidate, msg.EventID).Scan(&check)
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
			_, err = db.Exec("UPDATE event_candidates SET choice = ? WHERE candidate_id = ? AND event_id = ?", msg.Type, msg.Candidate, msg.EventID)
		}
		if err != nil {
			fmt.Println(err)
			return
		}
	}

}

func HandleEventNotif(w http.ResponseWriter, r *http.Request) {
	//REMIND: // TODO: WE COULD USE A NEW TABLE WITH SENDER, TARGET AND EVENT_ID
	if r.Method != http.MethodGet && r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var msg struct {
		CurrentUser string `json:"user"`
		ID          int    `json:"group_id"`
	}
	var currentUser string
	db := r.Context().Value("database").(*sql.DB)

	if r.Method == http.MethodPost {
		json.NewDecoder(r.Body).Decode(&msg)
		fmt.Println("dismissed", msg)
		currentUser = msg.CurrentUser
		_, err := db.Exec("UPDATE events SET pending = 0 WHERE id = ?", msg.ID)
		if err != nil {
			fmt.Println(err)
			return
		}
	} else {
		currentUser = r.URL.Query().Get("user")
	}

	var events []models.Event
	var event models.Event
	groupID, err := db.Query("SELECT group_members.group_id FROM social_groups INNER JOIN group_members ON group_members.group_id = social_groups.id WHERE group_members.member_id = ?", currentUser)
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

		rows, err := db.Query(`SELECT events.id,name,users.first_name,users.last_name,creator_id FROM events
		INNER JOIN users ON users.uuid = events.creator_id WHERE events.group_id = ? AND events.pending= 1`, group)
		if err != nil {
			fmt.Println(err)
			return
		}
		for rows.Next() {
			rows.Scan(
				&event.ID,
				&event.Name,
				&event.CreatorFirstName,
				&event.CreatorLastName,
				&event.Creator,
			)
			events = append(events, event)
		}
	}
	json.NewEncoder(w).Encode(events)
}
