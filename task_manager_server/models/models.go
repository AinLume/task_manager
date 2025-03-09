package models

type Task struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	ColumnID    int    `json:"column_id"`
	Position    int    `json:"position"`
}

type Column struct {
	ID             int    `json:"id"`
	Title          string `json:"title"`
	ColumnPosition int    `json:"position"`
}
