package main

import (
	"dately/src/config"
	"dately/src/db"
	"dately/src/endpoints"
	"dately/src/logging"
	"dately/src/middlewares"
	"embed"
	_ "embed"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"net/http"
)

//go:embed web/index.html
var indexFile []byte

//go:embed web/*
var webFS embed.FS

func main() {
	db.Migrate()

	app := fiber.New(fiber.Config{
		DisableStartupMessage: true,
	})

	app.Use(cors.New())
	app.Use(middlewares.NewLoggingMiddleware())
	app.Use(middlewares.NewErrorMiddleware())

	app.Post("/api/groups", endpoints.CreateGroup)
	app.Get("/api/groups/:key", endpoints.RetrieveGroup)
	app.Put("/api/groups/:key", endpoints.UpdateGroup)

	app.Post("/api/groups/:key/comments", endpoints.CreateComment)
	app.Get("/api/groups/:key/comments", endpoints.ListComments)

	app.Get("/api/groups/:key/votes", endpoints.ListVotes)
	app.Put("/api/groups/:key/votes", endpoints.UpdateVote)

	app.Use("/", filesystem.New(filesystem.Config{
		Root:       http.FS(webFS),
		PathPrefix: "web",
		Browse:     true,
	}))
	app.Get("*", func(c *fiber.Ctx) error {
		c.Status(http.StatusOK)
		c.Set("Content-Type", "text/html")
		return c.Send(indexFile)
	})

	logging.DLOG.Printf("Running fiber version %s", fiber.Version)
	logging.DLOG.Printf("%d Handlers found", app.HandlersCount())

	addr := fmt.Sprintf("%s:%s", config.ServerHost, config.ServerPort)
	logging.DLOG.Printf("Listening on %s", addr)

	logging.ELOG.Fatal(app.Listen(addr))
}
