package middlewares

import (
	"errors"
	"github.com/gofiber/fiber/v2"
)

func NewErrorMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		res := c.Next()
		if res != nil {
			var err *fiber.Error
			if errors.As(res, &err) {
				c.Status(err.Code)
				return err
			}
			c.Status(fiber.StatusInternalServerError)
			return fiber.NewError(fiber.StatusInternalServerError, res.Error())
		}

		return nil
	}
}
