package db

import (
	"crypto/sha1"
	"dately/src/logging"
	"dately/src/models"
	"encoding/hex"
	"io/fs"
	"sort"
	"strconv"
	"strings"
)

func Migrate() {
	entries, err := fs.ReadDir(migrationFS, "migrations")
	if err != nil {
		logging.ELOG.Fatal(err)
	}

	logging.DLOG.Printf("Found %d migrations", len(entries)-1)

	migrations := make([]*models.Migration, len(entries))
	for index, entry := range entries {
		rawIndexStr := strings.TrimSuffix(entry.Name(), ".sql")
		indexStr := strings.TrimPrefix(rawIndexStr, "0")
		migIndex, err := strconv.Atoi(indexStr)
		if err != nil {
			logging.ELOG.Fatal(err)
		}

		content, err := migrationFS.ReadFile("migrations/" + entry.Name())
		if err != nil {
			logging.ELOG.Fatal(err)
		}

		algorithm := sha1.New()
		algorithm.Write(content)

		migration := new(models.Migration)
		migration.Name = rawIndexStr
		migration.Index = migIndex
		migration.Content = string(content)
		migration.Sha1 = hex.EncodeToString(algorithm.Sum(nil))

		migrations[index] = migration
	}

	sort.Slice(migrations, func(i, j int) bool {
		return migrations[i].Index < migrations[j].Index
	})

	for _, migration := range migrations {
		// Always run the first migration
		if migration.Index == 0 {
			_, err = DB.Exec(migration.Content)
			if err != nil {
				logging.ELOG.Fatal(err)
			}
		} else {
			var exists bool
			err := DB.Get(&exists, "SELECT EXISTS(SELECT 1 FROM migrations WHERE \"index\" = $1)", migration.Index)
			if err != nil {
				logging.ELOG.Fatal(err)
			}

			if exists {
				logging.DLOG.Printf("Migration %s already applied. Skipping it...", migration.Name)
				continue
			}

			logging.DLOG.Printf("Migration %s is new. Applying it...", migration.Name)

			_, err = DB.Exec(migration.Content)
			if err != nil {
				logging.ELOG.Fatal(err)
			}

			_, err = DB.NamedExec("INSERT INTO migrations (\"index\", sha1) VALUES (:index, :sha1)", migration)
			if err != nil {
				logging.ELOG.Fatal(err)
			}

			logging.DLOG.Printf("Migration %s successfully applied", migration.Name)
		}
	}
}
