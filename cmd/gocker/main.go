package main

import (
	"context"
	"encoding/json"
	"net/http"

	containertypes "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type DockerHandler struct {
	DockerClient *client.Client
}

func (d DockerHandler) ListContainers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json")
	containers, err := d.DockerClient.ContainerList(context.Background(), containertypes.ListOptions{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return
	}
	json.NewEncoder(w).Encode(containers)
}
func (d DockerHandler) GetContainerById(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-type", "application/json")
	containerID := chi.URLParam(r, "id")
	container, err := d.DockerClient.ContainerInspect(context.Background(), containerID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(container)
}
func DockerRoutes(cli *client.Client) chi.Router {
	r := chi.NewRouter()
	DockerHandler := DockerHandler{DockerClient: cli}
	r.Get("/", DockerHandler.ListContainers)
	r.Get("/{id}", DockerHandler.GetContainerById)
	return r
}

// Server is the main server struct
type Server struct {
	Router       *chi.Mux
	DockerClient *client.Client
}

func NewServer(dockerClient *client.Client) *Server {
	return &Server{
		DockerClient: dockerClient,
	}
}

func (s *Server) Start() error {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))
	r.Get("/api/v1/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!"))
	})

	r.Mount("/api/v1/containers", DockerRoutes(s.DockerClient))
	return http.ListenAndServe(":3000", r)
}

func main() {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		panic(err)
	}
	defer cli.Close()
	server := NewServer(cli)
	if err := server.Start(); err != nil {
		panic(err)
	}
}
