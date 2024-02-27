package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	handler := http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		resp := []byte(`{"status": "ok"}`)
		rw.Header().Set("Content-Type", "application/json")
		rw.Header().Set("Content-Length", fmt.Sprint(len(resp)))
		rw.Write(resp)
	})

	log.Println("Server is available at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
