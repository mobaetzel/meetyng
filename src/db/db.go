package db

import (
	"dately/src/config"
	"fmt"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/jmoiron/sqlx"
	"log"
)

var DB *sqlx.DB

func init() {
	connUrl := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s",
		config.DatabaseUser,
		config.DatabasePass,
		config.DatabaseHost,
		config.DatabasePort,
		config.DatabaseName,
	)

	var err error
	DB, err = sqlx.Connect("pgx", connUrl)
	if err != nil {
		log.Fatalln(err)
	}
}
