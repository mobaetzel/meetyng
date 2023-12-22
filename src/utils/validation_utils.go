package utils

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func IsValidUUID(u string) bool {
	_, err := uuid.Parse(u)
	return err == nil
}

func GetUrlKey(ctx *fiber.Ctx) (string, error) {
	key := ctx.Params("key")
	if !IsValidUUID(key) {
		return "", fiber.NewError(fiber.StatusBadRequest, "invalid group key")
	}
	return key, nil
}
