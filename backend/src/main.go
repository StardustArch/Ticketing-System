package main

import (
	"fmt"
	"log"
	"net/http"
	"src/database"
	"src/routes"
	"github.com/rs/cors"
)

func main() {
	// Inicializa o banco de dados
	database.InitDB()

	// Configura as rotas
	router := routes.SetupRoutes()

	// Configuração do CORS
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:8081"}, // Permitir requisições do frontend
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"}, // Métodos permitidos
		AllowedHeaders: []string{"Content-Type", "Authorization"}, // Cabeçalhos permitidos
		AllowCredentials: true, // Permitir cookies e credenciais
	})

	// Aplica o middleware CORS
	handler := corsMiddleware.Handler(router)

	// Inicia o servidor
	port := ":8080"
	fmt.Printf("Server is running on port %s...\n", port)
	log.Fatal(http.ListenAndServe(port, handler))
}
