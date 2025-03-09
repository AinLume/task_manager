package main

import (
	"BD-service-go/db"
	"BD-service-go/handlers"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func main() {
	db, err := db.Connect()

	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	r := mux.NewRouter()
	r.HandleFunc("/columns", handlers.GetColumns(db)).Methods("GET")
	r.HandleFunc("/columns", handlers.CreateColumn(db)).Methods("POST")
	r.HandleFunc("/columns/{columnId}", handlers.GetColumnByID(db)).Methods("GET")
	r.HandleFunc("/columns/{columnId}", handlers.UpdateColumnByID(db)).Methods("PUT")
	r.HandleFunc("/columns/{columnId}", handlers.DeleteColumnByID(db)).Methods("DELETE")
	r.HandleFunc("/columns/{columnId}/tasks", handlers.GetTasksByColumnID(db)).Methods("GET")
	r.HandleFunc("/columns/{columnId}/tasks", handlers.AddTaskByColumnID(db)).Methods("POST")
	r.HandleFunc("/columns/{columnId}/tasks/{taskId}", handlers.UpdateTaskByColumnID(db)).Methods("PUT")
	r.HandleFunc("/columns/{columnId}/tasks/{taskId}", handlers.DeleteTaskByColumnID(db)).Methods("DELETE")

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
