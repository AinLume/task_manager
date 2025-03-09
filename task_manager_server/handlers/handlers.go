package handlers

import (
	. "BD-service-go/models"
	"database/sql"
	_ "database/sql"
	"encoding/json"
	_ "encoding/json"
	"github.com/gorilla/mux"
	"net/http"
	_ "net/http"
	"strconv"
	"strings"
)

/*
/columns GET POST - получаю все колонки или создаю новую
/columns/{columnId} GET PUT DELETE - получаю/изменяю/удаляю колонку по id
/columns/{columnId}/tasks GET POST - получаю или задаю массив таск по id колонки
/columns/{columnId}/tasks/{taskId} PUT DELETE - удаляю или изменяю задачу по id колонки и id задачи
*/

// GetColumns /columns GET
func GetColumns(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		var columns []Column
		rows, err := db.Query("SELECT id, title, column_position FROM columns")

		if err != nil {
			panic(err.Error())
		}

		defer rows.Close()
		for rows.Next() {
			var row Column
			err := rows.Scan(&row.ID, &row.Title, &row.ColumnPosition)
			if err != nil {
				panic(err.Error())
			}
			columns = append(columns, row)
		}
		json.NewEncoder(w).Encode(columns)
	}
}

// CreateColumn /columns POST
func CreateColumn(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		var column Column
		err := json.NewDecoder(r.Body).Decode(&column)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		query := "INSERT INTO columns (title, column_position) VALUES ($1, $2) RETURNING id"
		err = db.QueryRow(query, column.Title, column.ColumnPosition).Scan(&column.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(column)
	}
}

// GetColumnByID /columns/{columnId} GET
func GetColumnByID(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		path := strings.TrimPrefix(r.URL.Path, "/columns/")
		id, err := strconv.Atoi(path)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		var column Column
		row, err := db.Query("SELECT id, title, column_position FROM columns WHERE id = $1", id)
		err = row.Scan(&column.ID, &column.Title, &column.ColumnPosition)

		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Column not found", http.StatusNotFound)
			} else {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			return
		}

		json.NewEncoder(w).Encode(column)
	}
}

// UpdateColumnByID /columns/{columnId} PUT
func UpdateColumnByID(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		path := strings.TrimPrefix(r.URL.Path, "/columns/")
		id, err := strconv.Atoi(path)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		var column Column
		err = json.NewDecoder(r.Body).Decode(&column)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		query := "UPDATE columns SET title = $1, column_position = $2 WHERE id = $3"
		result, err := db.Exec(query, column.Title, column.ColumnPosition, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		rowsUpdated, err := result.RowsAffected()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if rowsUpdated == 0 {
			http.Error(w, "Column not found", http.StatusNotFound)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Column was updated"})
	}
}

// DeleteColumnByID /columns/{columnId} DELETE
func DeleteColumnByID(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		path := strings.TrimPrefix(r.URL.Path, "/columns/")
		id, err := strconv.Atoi(path)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		query := "DELETE FROM columns WHERE id = $1"
		result, err := db.Exec(query, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		rowsDeleted, err := result.RowsAffected()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if rowsDeleted == 0 {
			http.Error(w, "Column not found", http.StatusNotFound)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Column was deleted"})
	}
}

// GetTasksByColumnID /columns/{columnId}/tasks GET
func GetTasksByColumnID(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		vars := mux.Vars(r)
		idStr := vars["id"]

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		var tasks []Task
		rows, err := db.Query("SELECT id, title, description, position FROM tasks WHERE column_id = $1", id)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		for rows.Next() {
			var task Task
			err := rows.Scan(&task.ID, &task.Title, &task.Description, &task.Position)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			tasks = append(tasks, task)
		}
	}
}

// AddTaskByColumnID /columns/columnID/tasks POST
func AddTaskByColumnID(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		vars := mux.Vars(r)
		idStr := vars["id"]

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}

		var task Task
		err = json.NewDecoder(r.Body).Decode(&task)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		query := "INSERT INTO tasks (title, description, position) WHERE column_id = $1 VALUES ($2, $3, $4) RETURNING id"
		err = db.QueryRow(query, id, task.Title, task.Description, task.Position).Scan(&task.ID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(task)
	}
}

// UpdateTaskByColumnID /columns/{columnId}/tasks/{taskId} PUT
func UpdateTaskByColumnID(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		vars := mux.Vars(r)
		columnIdStr := vars["columnId"]
		taskIdStr := vars["taskId"]

		columnId, err := strconv.Atoi(columnIdStr)
		if err != nil {
			http.Error(w, "Invalid columnID", http.StatusBadRequest)
			return
		}

		taskId, err := strconv.Atoi(taskIdStr)
		if err != nil {
			http.Error(w, "Invalid taskID", http.StatusBadRequest)
			return
		}

		var task Task
		err = json.NewDecoder(r.Body).Decode(&task)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		query := "UPDATE tasks SET title = $1, description = $2, position = $3 WHERE id = $4 AND column_id = $5"
		result, err := db.Exec(query, task.Title, task.Description, task.Position, taskId, columnId)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		rowsUpdated, err := result.RowsAffected()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if rowsUpdated == 0 {
			http.Error(w, "Task not found", http.StatusNotFound)
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Task was updated"})
	}
}

// DeleteTaskByColumnID /columns/{columnId}/tasks/{taskId} DELETE
func DeleteTaskByColumnID(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		vars := mux.Vars(r)
		columnIdStr := vars["columnId"]
		taskIdStr := vars["taskId"]

		columnId, err := strconv.Atoi(columnIdStr)
		if err != nil {
			http.Error(w, "Invalid columnID", http.StatusBadRequest)
			return
		}

		taskId, err := strconv.Atoi(taskIdStr)
		if err != nil {
			http.Error(w, "Invalid taskID", http.StatusBadRequest)
			return
		}

		query := "DELETE FROM tasks WHERE column_id = $1 AND id = $2"
		result, err := db.Exec(query, columnId, taskId)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		rowDeleted, err := result.RowsAffected()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if rowDeleted == 0 {
			http.Error(w, "Task not found", http.StatusNotFound)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Task was deleted"})
	}
}
