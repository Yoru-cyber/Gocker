package main

import (
	"context"
	"net/http"

	"encoding/json"

	containertypes "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	ctx := context.Background()
	//Client to interact with Docker api
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		panic(err)
	}
	defer cli.Close()
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))
	r.Get("/api/v1/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!"))
	})
	r.Get("/api/v1/containers/all", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-type", "application/json")
		containers, err := cli.ContainerList(ctx, containertypes.ListOptions{})
		if err != nil {
			panic(err)
		}
		json.NewEncoder(w).Encode(containers)
	})
	http.ListenAndServe(":3000", r)
	// containers, err := cli.ContainerList(ctx, containertypes.ListOptions{})
	// if err != nil {
	// 	panic(err)
	// }

	// jsonBytes, err := json.Marshal(containers)
	// if err != nil {
	// 	panic(err)
	// }
	// fmt.Println(string(jsonBytes))
	// for _, ctr := range containers {

	// }

	//	for _, container := range containers {
	//		fmt.Println(container.ID)
	//	}
}
