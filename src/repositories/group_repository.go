package repositories

import (
	"database/sql"
	"dately/src/db"
	"dately/src/models"
	"errors"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"time"
)

type GroupRepository struct {
}

func (r *GroupRepository) Create(group *models.Group) (*models.Group, error) {
	group.Key = uuid.New().String()
	group.AdminKey = uuid.New().String()
	group.Created = time.Now()
	group.Updated = time.Now()

	_, err := db.DB.NamedExec("INSERT INTO groups (key, admin_key, admin_name, admin_mail, title, location, description, created, updated) VALUES (:key, :admin_key, :admin_name, :admin_mail, :title, :location, :description, :created, :updated)", group)
	if err != nil {
		return nil, err
	}

	for index, option := range group.Options {
		option.Key = uuid.New().String()
		option.GroupKey = group.Key

		_, err = db.DB.NamedExec("INSERT INTO options (key, group_key, date) VALUES (:key, :group_key, :date)", option)
		if err != nil {
			_, delErr := db.DB.Exec("DELETE FROM groups WHERE key = $1", group.Key)
			if delErr != nil {
				panic(delErr)
			}
			return nil, err
		}

		group.Options[index] = option
	}

	return group, nil
}

func (r *GroupRepository) Retrieve(key string) (*models.Group, error) {
	group := new(models.Group)
	err := db.DB.Get(group, "SELECT * FROM groups WHERE key = $1", key)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fiber.NewError(fiber.StatusNotFound, "group not found")
		} else {
			return nil, err
		}
	}

	options := make([]models.Option, 0)
	err = db.DB.Select(&options, "SELECT * FROM options WHERE group_key = $1", key)
	if err != nil {
		return nil, err
	}

	for index, option := range options {
		options[index].Date = option.Date[:10]
	}

	group.Options = options
	group.AdminKey = ""
	group.AdminMail = ""

	return group, nil
}

func (r *GroupRepository) Update(groupKey string, adminKey string, group *models.Group) (*models.Group, error) {
	group.Updated = time.Now()
	group.Key = groupKey
	group.AdminKey = adminKey

	res, err := db.DB.NamedExec("UPDATE groups SET title = :title, location = :location, description = :description, updated = :updated WHERE key = :key AND admin_key = :admin_key", group)
	if err != nil {
		return nil, err
	}
	affectedRows, err := res.RowsAffected()
	if err != nil {
		return nil, err
	}
	if affectedRows == 0 {
		return nil, fiber.NewError(fiber.StatusNotFound, "group not found")
	}

	existingOptions, err := r.Retrieve(groupKey)
	if err != nil {
		return nil, err
	}

	for index, option := range group.Options {
		option.Date = option.Date[:10]
		option.GroupKey = group.Key
		var exists bool
		err := db.DB.Get(&exists, "SELECT EXISTS(SELECT 1 FROM options WHERE group_key = $1 AND date = $2)", option.GroupKey, option.Date)
		if err != nil {
			return nil, err
		}

		if exists {
			// remove from existingOptions to avoid deleting it later
			for i, existingOption := range existingOptions.Options {
				if existingOption.Date == option.Date {
					existingOptions.Options = append(existingOptions.Options[:i], existingOptions.Options[i+1:]...)
					break
				}
			}
		} else {
			option.Key = uuid.New().String()
			option.GroupKey = group.Key

			query := "INSERT INTO options (key, group_key, date) VALUES (:key, :group_key, :date)"
			_, err = db.DB.NamedExec(query, option)
			if err != nil {
				return nil, err
			}

			group.Options[index] = option
		}
	}

	// delete options that are not in the request
	for _, option := range existingOptions.Options {
		query := "DELETE FROM options WHERE group_key = $1 AND date = $2"
		_, err = db.DB.Exec(query, option.GroupKey, option.Date)
		if err != nil {
			return nil, err
		}
	}

	return group, nil
}
