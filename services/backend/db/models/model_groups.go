package models

import "time"

type Groups struct {
	ID           int       `json:"id"`
	CreationDate time.Time `json:"creationDate"`
	CreatorID    id        `json:"creatorID"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
}
