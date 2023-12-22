package models

type Migration struct {
	Name    string `db:"-"`
	Index   int    `db:"index"`
	Sha1    string `db:"sha1"`
	Content string `db:"-"`
}
