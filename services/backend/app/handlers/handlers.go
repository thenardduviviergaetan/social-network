package handlers

import (
	"fmt"
	"net/http"
)

func Handlers() {
	http.HandleFunc("/api/status", func(rw http.ResponseWriter, req *http.Request) {
		resp := []byte(`{"status": "ok"}`)
		rw.Header().Set("Content-Type", "application/json")
		rw.Header().Set("Content-Length", fmt.Sprint(len(resp)))
		rw.Write(resp)
	})
}
