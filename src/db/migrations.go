package db

import (
	"embed"
	_ "embed"
)

//go:embed migrations/*.sql
var migrationFS embed.FS
