package livechat

import (
	"database/sql"
	"fmt"
	"net/http"
	"server/sessions"

	"github.com/gorilla/websocket"
)

type Client struct {
	hub      *Hub
	conn     *websocket.Conn
	send     chan []byte
	Username string   `json:"username"`
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

	client := &Client{Username: , //TODO: handle user first name / lastname /username ?
		hub:    hub,
		conn:   conn,
		send:   make(chan []byte, 256),
		Online: true}
	client.hub.register <- client
	go client.Write()
	go client.Read()
}
