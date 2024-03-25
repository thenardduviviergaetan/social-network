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
	Id        int    `json:"id"`
	CreatorId string `json:"creator_id"`
	// REMIND: ON VEUT AUSSI CHECK SI LE MEC EST MEMBRE POUR POUVOIR AFFICHER LE BOUTON (rajouter un boolean ?:)
	CreationDate     time.Time `json:"creation_date"`
	CreatorFirstName string    `json:"creator_first_name"`
	CreatorLastName  string    `json:"creator_last_name"`
	Name             string    `json:"name"`
	Description      string    `json:"description"`
	Members          []User    `json:"members"`
}

type Event struct {
	Date        string `json:"date"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Creator     string `json:"creator"`
	Group       int    `json:"group_id"`
}
