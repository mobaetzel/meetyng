package models

import "time"

type Group struct {
	Key string `json:"key" db:"key"`

	AdminKey  string `json:"adminKey" db:"admin_key"`
	AdminName string `json:"adminName" db:"admin_name"`
	AdminMail string `json:"adminMail" db:"admin_mail"`

	Title       string `json:"title" db:"title"`
	Location    string `json:"location" db:"location"`
	Description string `json:"description" db:"description"`

	Created time.Time `json:"created" db:"created"`
	Updated time.Time `json:"updated" db:"updated"`

	Options []Option `json:"options" db:"-"`
}
