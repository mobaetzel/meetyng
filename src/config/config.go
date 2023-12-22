package config

import "os"

var (
	ServerHost string
	ServerPort string

	LogLevel string

	DatabaseHost string
	DatabasePort string
	DatabaseName string
	DatabaseUser string
	DatabasePass string
)

func init() {
	ServerHost = getEnvValueWithDefault("SERVER_HOST", "localhost")
	ServerPort = getEnvValueWithDefault("SERVER_PORT", "8080")
	LogLevel = getEnvValueWithDefault("LOG_LEVEL", "error")
	DatabaseHost = getEnvValueWithDefault("DATABASE_HOST", "localhost")
	DatabasePort = getEnvValueWithDefault("DATABASE_PORT", "5432")
	DatabaseName = getEnvValueWithDefault("DATABASE_NAME", "meetyng")
	DatabaseUser = getEnvValueWithDefault("DATABASE_USER", "meetyng")
	DatabasePass = getEnvValueWithDefault("DATABASE_PASS", "meetyng")
}

func getEnvValueWithDefault(key string, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
