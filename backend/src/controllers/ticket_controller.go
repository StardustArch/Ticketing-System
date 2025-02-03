package controllers

import (
	"encoding/json"
	"net/http"
	"src/services"

	"github.com/google/uuid"
	// "github.com/gorilla/mux"
)

// Função para criar um ticket
func CreateTicket(w http.ResponseWriter, r *http.Request) {
	// Verifica se o usuário está autenticado
	user, err := services.VerifyToken(w, r)
	if err != nil {
		http.Error(w, "Usuário não autenticado", http.StatusUnauthorized)
		return
	}

	// Parse do corpo da requisição
	var ticketRequest struct {
		EventID uuid.UUID `json:"event_id" binding:"required"`
	}
	if err := json.NewDecoder(r.Body).Decode(&ticketRequest); err != nil {
		http.Error(w, "Corpo da requisição inválido", http.StatusBadRequest)
		return
	}

	// Chama a função de service para criar o ticket
	ticket, err := services.CreateTicket(ticketRequest.EventID, user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Retorna o ticket criado
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ticket)
}

// Função para listar tickets de um comprador
func GetTickets(w http.ResponseWriter, r *http.Request) {
	// Verifica se o usuário está autenticado
	user, err := services.VerifyToken(w, r)
	if err != nil {
		return
	}

	// Chama a função de service para listar os tickets do usuário
	tickets, err := services.GetTicketsByUser(user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Retorna a lista de tickets
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tickets)
}

// // Função para listar tickets de um evento
// func GetTicketsByEvent(w http.ResponseWriter, r *http.Request) {
// 	// Extrai o ID do evento da URL
// 	vars := mux.Vars(r)
// 	eventID, err := uuid.Parse(vars["eventID"])
// 	if err != nil {
// 		http.Error(w, "Invalid event ID", http.StatusBadRequest)
// 		return
// 	}

// 	// Chama a função de serviço para listar os tickets do evento
// 	tickets, err := services.GetTicketsByEvent(eventID)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	// Retorna a lista de tickets
// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(tickets)
// }
