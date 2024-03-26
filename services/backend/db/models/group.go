package models

import "time"

type Groups struct {
	ID           int       `json:"id"`
	CreationDate time.Time `json:"creation_date"`
	CreatorID    string    `json:"creator_id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
}

type Group struct {
	Id               int       `json:"id"`
	CreatorId        string    `json:"creator_id"`
	CreationDate     time.Time `json:"creation_date"`
	CreatorFirstName string    `json:"creator_first_name"`
	CreatorLastName  string    `json:"creator_last_name"`
	Name             string    `json:"name"`
	Description      string    `json:"description"`
	Members          []User    `json:"members"`
}

type Member struct {
	UUID           string `json:"uuid"`
	FirstName      string `json:"firstName"`
	LastName       string `json:"lastName"`
	Avatar         string `json:"avatar"`
	GroupRequested int    `json:"group_requested"`
}

type Invite struct {
	GroupID         int    `json:"groupId"`
	GroupName       string `json:"groupName"`
	Sender          string `json:"sender"`
	SenderFirstName string `json:"senderFirstName"`
	SenderLastName  string `json:"senderLastName"`
	Target          string `json:"target"`
}
