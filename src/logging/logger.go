package logging

import (
	"dately/src/config"
	"io"
	"log"
)

var DLOG *log.Logger
var ELOG *log.Logger

func init() {
	if config.LogLevel == "debug" {
		DLOG = log.New(log.Writer(), "[DEBUG] ", log.Ldate|log.Ltime|log.Lshortfile)
	} else {
		DLOG = log.New(io.Discard, "", 0)
	}
	ELOG = log.New(log.Writer(), "[ERROR] ", log.Ldate|log.Ltime|log.Lshortfile)
}
