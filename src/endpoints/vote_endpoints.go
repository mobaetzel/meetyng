package endpoints

import (
	"dately/src/models"
	"dately/src/repositories"
	"dately/src/utils"
	"github.com/gofiber/fiber/v2"
)

func UpdateVote(c *fiber.Ctx) error {
	key, err := utils.GetUrlKey(c)
	if err != nil {
		return err
	}

	vote := new(models.Vote)

	if err := c.BodyParser(vote); err != nil {
		return err
	}

	group, err := new(repositories.VoteRepository).Update(key, vote)
	if err != nil {
		return err
	}

	return c.JSON(group)
}

func ListVotes(c *fiber.Ctx) error {
	key, err := utils.GetUrlKey(c)
	if err != nil {
		return err
	}

	votes, err := new(repositories.VoteRepository).List(key)
	if err != nil {
		return err
	}

	if err := c.JSON(votes); err != nil {
		return err
	}

	return nil
}
