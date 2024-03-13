package models

type Post struct {
	AuthorID string `json:"author_id"`
	Author   string `json:"author"`
	Content  string `json:"content"`
	Status   string `json:"status"`
	Date     string `json:"date"`
}
