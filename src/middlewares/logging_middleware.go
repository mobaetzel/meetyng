package middlewares

import (
	"dately/src/logging"
	"github.com/gofiber/fiber/v2"
	"time"
)

func NewLoggingMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		start := time.Now()
		res := c.Next()
		duration := time.Since(start)
		logging.DLOG.Printf("%s [%d] %s %d ms", c.Method(), c.Response().StatusCode(), c.Path(), duration.Milliseconds())
		return res
	}
}
