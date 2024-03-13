package models

type Post struct {
	ID       int         `json:"id"`
	AuthorID string      `json:"author_id"`
	Author   string      `json:"author"`
	Content  string      `json:"content"`
	Status   string      `json:"status"`
	Image    interface{} `json:"image"`
	Date     string      `json:"date"`
}
