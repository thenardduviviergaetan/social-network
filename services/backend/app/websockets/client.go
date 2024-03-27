package livechat

import (
	"database/sql"
	"fmt"
	"net/http"

	"server/app/middleware"

	"github.com/gorilla/websocket"
)

type Groupe struct {
	Name string `json:"name"`
	Id   string `json:"id"`
}

type Client struct {
	hub      *Hub
	conn     *websocket.Conn
	send     chan []byte
	group    map[string]*Groupe
	tabgroup []*Groupe
	Username string   `json:"username"`
	UUID     string   `json:"uuid"`
	Online   bool     `json:"online"`
	Message  string   `json:"message"`
	LastMsg  []string `json:"last_msg"`
	Msg_type string   `json:"msg_type"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func GetGroupe(db *sql.DB, userUUID string) map[string]*Groupe {
	tab := middleware.GetAllGroupUsers(db, userUUID)
	tabGroup := make(map[string]*Groupe)
	for _, group := range tab {
		tabGroup[group[0]] = &Groupe{Name: group[1], Id: group[0]}
	}
	return tabGroup
}

func (c *Client) Read() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	for {
		_, msg, err := c.conn.ReadMessage()
		if err != nil {
			fmt.Println(err)
			c.hub.unregister <- c
			c.conn.Close()
			break
		}
		c.hub.broadcast <- msg
	}
}

func (c *Client) Write() {
	defer func() {
		c.conn.Close()
	}()
	for msg := range c.send {
		w, err := c.conn.NextWriter(websocket.TextMessage)
		if err != nil {
			return
		}
		w.Write(msg)
		for len(c.send) > 0 {
			w.Write(<-c.send)
		}
		if err := w.Close(); err != nil {
			return
		}
	}
}

func WebsocketHandler(db *sql.DB, hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	_, msg, err := conn.ReadMessage()
	if err != nil {
		fmt.Println(err)
		conn.Close()
		return
	}
	client := &Client{
		UUID:     string(msg),
		Username: middleware.GetUsersname(db, string(msg)),
		group:    GetGroupe(db, string(msg)),
		hub:      hub,
		conn:     conn,
		send:     make(chan []byte, 256),
		Online:   true,
	}
	client.hub.register <- client
	go client.Write()
	go client.Read()
}

func (c *Client) reloadGroup(db *sql.DB) {
	groupe := GetGroupe(db, c.UUID)
	c.group = groupe
	tab := []*Groupe{}
	for _, group := range groupe {
		tab = append(tab, group)
	}
	c.tabgroup = tab
}
