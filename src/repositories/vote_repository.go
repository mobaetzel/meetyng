package repositories

import (
	"dately/src/db"
	"dately/src/models"
	"time"
)

type VoteRepository struct {
}

func (r *VoteRepository) Update(groupKey string, vote *models.Vote) (*models.Vote, error) {
	vote.GroupKey = groupKey
	vote.Created = time.Now()

	var exists bool
	existsQuery := "SELECT EXISTS(SELECT 1 FROM votes WHERE group_key = $1 AND option_key = $2 AND voter_name = $3)"
	err := db.DB.Get(&exists, existsQuery, vote.GroupKey, vote.OptionKey, vote.VoterName)

	if err != nil {
		return vote, err
	}

	if exists {
		query := "UPDATE votes SET value = :value WHERE group_key = :group_key AND option_key = :option_key AND voter_name = :voter_name"
		_, err = db.DB.NamedExec(query, vote)
	} else {
		query := "INSERT INTO votes (group_key, option_key, voter_name, value, created) VALUES (:group_key, :option_key, :voter_name, :value, :created)"
		_, err = db.DB.NamedExec(query, vote)
	}

	return vote, err
}

func (r *VoteRepository) List(groupKey string) ([]models.Vote, error) {
	votes := make([]models.Vote, 0)
	err := db.DB.Select(&votes, "SELECT * FROM votes WHERE group_key = $1", groupKey)
	return votes, err
}
