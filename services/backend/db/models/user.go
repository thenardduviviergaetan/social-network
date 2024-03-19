package models

type User struct {
	UUID        string `json:"uuid"`
	Email       string `json:"email"`
	Password    string `json:"password"`
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	DateOfBirth string `json:"dateOfBirth"`
	Status      string `json:"status"`
	Nickname    string `json:"nickname"`
	About       string `json:"about"`
}

type Login struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
