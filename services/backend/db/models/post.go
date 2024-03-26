package models

type Post struct {
	ID         int         `json:"id"`
	AuthorID   string      `json:"author_id"`
	Author     string      `json:"author"`
	GroupID    int         `json:"group_id"`
	Content    string      `json:"content"`
	Status     string      `json:"status"`
	Authorized interface{} `json:"authorized"`
	Image      interface{} `json:"image"`
	Date       string      `json:"date"`
}
