package models

type Post struct {
	AuthorID string `json:"author_id"`
	Author   string `json:"author"`
	Content  string `json:"content"`
	Status   string `json:"status"`
	Image    string `json:"image"`
	Date     string `json:"date"`
}
