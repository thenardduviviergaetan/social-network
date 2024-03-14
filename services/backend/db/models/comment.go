package models

type Comment struct {
	ID       int         `json:"id"`
	AuthorID string      `json:"author_id"`
	Author   string      `json:"author"`
	PostID   int         `json:"post_id"`
	Content  string      `json:"content"`
	Status   string      `json:"status"`
	Image    interface{} `json:"image"`
	Date     string      `json:"date"`
}
