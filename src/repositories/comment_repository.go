package repositories

import (
	"dately/src/db"
	"dately/src/models"
	"github.com/google/uuid"
	"time"
)

type CommentRepository struct {
}

func (r *CommentRepository) Create(groupKey string, comment *models.Comment) (*models.Comment, error) {
	comment.Key = uuid.New().String()
	comment.GroupKey = groupKey
	comment.Created = time.Now()

	query := "INSERT INTO comments (key, group_key, author_name, comment, created) VALUES (:key, :group_key, :author_name, :comment, :created)"
	_, err := db.DB.NamedExec(query, comment)

	return comment, err
}

func (r *CommentRepository) List(groupKey string) ([]models.Comment, error) {
	comments := make([]models.Comment, 0)
	err := db.DB.Select(&comments, "SELECT * FROM comments WHERE group_key = $1 ORDER BY created ASC", groupKey)
	return comments, err
}
