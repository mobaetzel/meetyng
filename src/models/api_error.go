package models

type ApiError struct {
	StatusCode int    `json:"statusCode"`
	Message    string `json:"message"`
}
