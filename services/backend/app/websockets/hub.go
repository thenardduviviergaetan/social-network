package livechat

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"log"
	"strings"

	"server/app"
	"server/app/middleware"
)

type Hub struct {
	clients    map[string]*Client
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
	status     []*Client
}
type Message struct {
	Msg_type   string `json:"msg_type"`
	Content    string `json:"content"`
	TypeTarget string `json:"type_target"`
	Target     string `json:"target"`
	Sender     string `json:"sender"`
	SenderName string `json:"sender_name"`
	Date       string `json:"date"`
	Image      string `json:"image"`
}
type StatusMessage struct {
	Msg_type string    `json:"msg_type"`
	Target   string    `json:"target"`
	Status   []*Client `json:"status"`
	Groupe   []*Groupe `json:"groupe"`
}
type HistoryMessage struct {
	Msg_type   string     `json:"msg_type"`
	Target     string     `json:"target"`
	TabMessage []*Message `json:"tab_message"`
}

func InitHub(app *app.App) *Hub {
	users := middleware.GetAllUsers(app.DB.DB)
	offlineInit := make([]*Client, 0)
	for _, user := range users {
		client := &Client{UUID: user[0], Username: user[1], send: make(chan []byte)}
		offlineInit = append(offlineInit, client)
	}
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[string]*Client),
		status:     offlineInit,
	}
}

func (h *Hub) Run(app *app.App) {
	for {
		select {
		case client := <-h.register:
			client.Online = true
			h.clients[client.UUID] = client
			h.status = Remove(h.status, client)
			h.status = append(h.status, client)
			h.SendStatusMessage(app, client)
		case client := <-h.unregister:
			if _, ok := h.clients[client.UUID]; ok {
				client.Online = false
				h.status = Remove(h.status, client)
				h.status = append(h.status, client)
				h.SendStatusMessage(app, client)
				close(h.clients[client.UUID].send)
				delete(h.clients, client.UUID)
			}
		case message := <-h.broadcast:
			msg := &Message{}
			json.Unmarshal(message, msg)
			switch msg.Msg_type {
			case "notification":
				notif := &Message{Msg_type: "notification", Target: msg.Target, Sender: msg.Sender}
				jsonNotif, _ := json.Marshal(notif)
				h.SendMessageToTarget(app, msg.Target, jsonNotif)
			case "chat":
				h.SendMessageToTarget(app, msg.Target, message)
			case "typing":
				typing := &Message{Msg_type: "typing", Target: msg.Target, Sender: msg.Sender}
				if msg.Content == "typing" {
					typing.Content = "typing"
				} else {
					typing.Content = "stop"
				}
				jsonTyping, _ := json.Marshal(typing)
				h.SendMessageToTarget(app, msg.Target, jsonTyping)
			case "history":
				if msg.TypeTarget == "user" {
					tabmsg, err := GetOldMessages(app, "chat_users", msg.Sender, msg.Target, 100, 0)
					if err != nil {
						log.Println(err)
						return
					}
					sendmsg := &HistoryMessage{Msg_type: "history", Target: msg.Target, TabMessage: tabmsg}
					jsonMessage, _ := json.Marshal(sendmsg)
					h.clients[msg.Sender].send <- jsonMessage
				} else if msg.TypeTarget == "group" {
					tabmsg, err := GetOldMessages(app, "chat_groups", msg.Sender, msg.Target, 100, 0)
					if err != nil {
						log.Println(err)
						return
					}
					sendmsg := &HistoryMessage{Msg_type: "history", Target: msg.Target, TabMessage: tabmsg}
					jsonMessage, _ := json.Marshal(sendmsg)
					h.clients[msg.Sender].send <- jsonMessage
				}
			}
		}
	}
}

func (h *Hub) SendStatusMessage(app *app.App, current *Client) {
	h.clients[current.UUID].LastMsg = []string{}
	h.clients[current.UUID].LastMsg = GetLastestMessages(app, current.UUID)
	for c := range h.clients {
		h.clients[c].reloadGroup(app.DB.DB)
		msg := &StatusMessage{Msg_type: "status", Target: current.UUID, Status: h.status, Groupe: h.clients[c].tabgroup}
		jsonClients, _ := json.Marshal(msg)
		h.clients[c].send <- jsonClients
	}
}

func (h *Hub) SendMessageToTarget(app *app.App, UUID string, message []byte) {
	msg := &Message{}
	json.Unmarshal(message, msg)
	msg.SenderName = middleware.GetUsersname(app.DB.DB, msg.Sender)
	message, _ = json.Marshal(msg)
	if msg.Msg_type == "chat" {
		if msg.TypeTarget == "user" {
			for _, client := range h.clients {
				if client.UUID == msg.Target || client.UUID == msg.Sender {
					client.send <- message
				}
			}
			SavePrivateMessage(app, msg, "chat_users")
		} else if msg.TypeTarget == "group" {
			for _, client := range h.clients {
				if client.group[msg.Target] != nil {
					client.send <- message
				}
			}
			SavePrivateMessage(app, msg, "chat_groups")
		}
	}
	if msg.Msg_type == "notification" {
		if client, ok := h.clients[UUID]; ok {
			if client.UUID == msg.Target {
				client.send <- message
			}
		}
	}
	if msg.Msg_type == "typing" {
		if client, ok := h.clients[UUID]; ok {
			if client.UUID == msg.Target {
				client.send <- message
			}
		}
	}
}

func Remove(clients []*Client, c *Client) []*Client {
	index := -1
	for i, v := range clients {
		if v.UUID == c.UUID {
			index = i
			break
		}
	}
	if index == -1 {
		return clients
	}
	return append(clients[:index], clients[index+1:]...)
}

func SavePrivateMessage(app *app.App, message *Message, table string) error {
	var image []byte
	if message.Image != "" {
		dataURLParts := strings.Split(message.Image, ",")
		if len(dataURLParts) != 2 {
			return errors.New("invalid base64 data")
		}
		image, _ = base64.StdEncoding.DecodeString(dataURLParts[1])
	}
	_, err := app.DB.Exec(
		"INSERT INTO "+table+"(sender, target, message_content, creation_date, link_image) VALUES (?,?,?,datetime(),?)",
		message.Sender,
		message.Target,
		message.Content,
		image,
	)
	return err
}

func GetOldMessages(app *app.App, table, sender, target string, limit, offset int) ([]*Message, error) {
	var rows *sql.Rows
	var err error
	if table == "chat_users" {
		rows, err = app.DB.Query("SELECT sender, target, message_content, creation_date,link_image FROM chat_users WHERE ((target = ? AND sender = ?) OR (target = ? AND sender = ?)) ORDER BY creation_date ASC LIMIT ? OFFSET ?",
			target,
			sender,
			sender,
			target,
			limit,
			offset)
		if err != nil {
			return nil, err
		}
	} else {
		rows, err = app.DB.Query("SELECT sender, target, message_content, creation_date,link_image FROM chat_groups WHERE target = ? ORDER BY creation_date ASC LIMIT ? OFFSET ?",
			target,
			limit,
			offset)
		if err != nil {
			log.Println("Error get old message groupe", err)
			return nil, err
		}
	}
	defer rows.Close()
	messages := []*Message{}
	for rows.Next() {
		message := &Message{Msg_type: "history"}
		blob := make([]byte, 0)
		if err := rows.Scan(&message.Sender, &message.Target, &message.Content, &message.Date, &blob); err != nil {
			return nil, err
		}
		message.SenderName = middleware.GetUsersname(app.DB.DB, message.Sender)
		message.Image = base64.StdEncoding.EncodeToString(blob)
		messages = append(messages, message)
	}
	return messages, nil
}

func GetLastestMessages(app *app.App, target string) []string {
	clients := []string{}
	rows, err := app.DB.Query("SELECT sender FROM private_messages WHERE target = ? ORDER BY creation_date DESC", target)
	if err != nil {
		return nil
	}
	defer rows.Close()
	for rows.Next() {
		var sender string
		if err := rows.Scan(&sender); err != nil {
			return nil
		}
		if !contains(clients, sender) {
			clients = append(clients, sender)
		}
	}
	return clients
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}
