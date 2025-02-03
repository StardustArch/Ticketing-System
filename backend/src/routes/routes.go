package routes

import (
	"github.com/gorilla/mux"
	"src/controllers"
)

// Configura as rotas
func SetupRoutes() *mux.Router {
	router := mux.NewRouter()

	// Rota para registrar um usuário
	router.HandleFunc("/register", controllers.RegisterUser).Methods("POST")

	// Rota para fazer login
	router.HandleFunc("/login", controllers.LoginUser).Methods("POST")

	// Rota protegida: retorna o nome do usuário logado
	router.HandleFunc("/hello", controllers.HelloHandler).Methods("GET")

	// Rota para atualizar informações do usuário
	router.HandleFunc("/user", controllers.UpdateUser).Methods("PUT")

	// Rota para alterar a senha
	router.HandleFunc("/user/password", controllers.ChangePassword).Methods("PUT")

	// Rota para obter informações do usuário
	router.HandleFunc("/user", controllers.GetUserInfo).Methods("GET")

	// Rota para criar um evento (protegida)
	router.HandleFunc("/events", controllers.CreateEvent).Methods("POST")

	// Rota para listar eventos de um organizador (protegida)
	router.HandleFunc("/events", controllers.GetEvents).Methods("GET")
	
	// Rota para Obter todos eventos (protegida)
	router.HandleFunc("/events/future", controllers.GetFutureEvents).Methods("GET")

	// Rota para buscar um evento específico
	router.HandleFunc("/events/{eventID}", controllers.GetEvent).Methods("GET")

	// Rota para atualizar um evento (protegida)
	router.HandleFunc("/events/{id}", controllers.UpdateEvent).Methods("PUT")

	// Rota para deletar um evento (protegida)
	router.HandleFunc("/events/{id}", controllers.DeleteEvent).Methods("DELETE")

	// Rota para criar um ticket (protegida)
	router.HandleFunc("/tickets", controllers.CreateTicket).Methods("POST")

	// Rota para obter informações de tickets (protegida)
	router.HandleFunc("/tickets", controllers.GetTickets).Methods("GET")

	return router
}
