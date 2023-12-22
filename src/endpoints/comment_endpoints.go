package endpoints

import (
	"dately/src/models"
	"dately/src/repositories"
	"dately/src/utils"
	"github.com/gofiber/fiber/v2"
)

func CreateComment(c *fiber.Ctx) error {
	key, err := utils.GetUrlKey(c)
	if err != nil {
		return err
	}

	comment := new(models.Comment)

	if err := c.BodyParser(comment); err != nil {
		return err
	}

	group, err := new(repositories.CommentRepository).Create(key, comment)
	if err != nil {
		return err
	}

	return c.JSON(group)
}

func ListComments(c *fiber.Ctx) error {
	key, err := utils.GetUrlKey(c)
	if err != nil {
		return err
	}

	comments, err := new(repositories.CommentRepository).List(key)
	if err != nil {
		return err
	}

	return c.JSON(comments)
}
