package models

type Option struct {
	Key      string `json:"key" db:"key"`
	GroupKey string `json:"-" db:"group_key"`
	Date     string `json:"date" db:"date"`
}
