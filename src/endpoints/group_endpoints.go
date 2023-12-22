package endpoints

import (
	"dately/src/models"
	"dately/src/repositories"
	"dately/src/utils"
	"github.com/gofiber/fiber/v2"
)

func CreateGroup(c *fiber.Ctx) error {
	group := new(models.Group)

	if err := c.BodyParser(group); err != nil {
		return err
	}

	group, err := new(repositories.GroupRepository).Create(group)
	if err != nil {
		return err
	}

	return c.JSON(group)
}

func RetrieveGroup(c *fiber.Ctx) error {
	key, err := utils.GetUrlKey(c)
	if err != nil {
		return err
	}

	group, err := new(repositories.GroupRepository).Retrieve(key)
	if err != nil {
		return err
	}

	return c.JSON(group)
}

func UpdateGroup(c *fiber.Ctx) error {
	groupKey, err := utils.GetUrlKey(c)
	if err != nil {
		return err
	}

	adminKey := c.Get("Authorization")
	if !utils.IsValidUUID(adminKey) {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid admin key")
	}

	group := new(models.Group)

	if err := c.BodyParser(group); err != nil {
		return err
	}

	group, err = new(repositories.GroupRepository).Update(groupKey, adminKey, group)
	if err != nil {
		return err
	}

	return c.JSON(group)
}
