package models

import "time"

const (
	VoteValueYes   = 1
	VoteValueMaybe = 2
	VoteValueNo    = 3
)

type Vote struct {
	GroupKey  string `json:"-" db:"group_key"`
	OptionKey string `json:"optionKey" db:"option_key"`

	VoterName string `json:"voterName" db:"voter_name"`

	Value int `json:"value" db:"value"`

	Created time.Time `json:"created" db:"created"`
}
