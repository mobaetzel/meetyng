package models

import "time"

type Comment struct {
	Key      string `json:"key" db:"key"`
	GroupKey string `json:"-" db:"group_key"`

	AuthorName string `json:"authorName" db:"author_name"`

	Comment string `json:"comment" db:"comment"`

	Created time.Time `json:"created" db:"created"`
}
