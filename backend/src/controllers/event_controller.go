package controllers

import (
	"encoding/json"
	"net/http"
	"src/services"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

// Função para criar um evento
func CreateEvent(w http.ResponseWriter, r *http.Request) {
	// Verifica se o usuário está autenticado
	user, err := services.VerifyToken(w, r)
	if err != nil {
		return
	}

	// Parse do corpo da requisição
	var eventRequest struct {
		Name        string    `json:"name"`
		Description string    `json:"description"`
		Location    string    `json:"location"`
		Date        time.Time `json:"date"`
	}
	if err := json.NewDecoder(r.Body).Decode(&eventRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Chama a função de service para criar o evento
	event, err := services.CreateEvent(eventRequest.Name, eventRequest.Description, eventRequest.Location, eventRequest.Date, user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Retorna o evento criado
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(event)
}

// Função para listar eventos de um organizador
func GetEvents(w http.ResponseWriter, r *http.Request) {
	// Verifica se o usuário está autenticado
	user, err := services.VerifyToken(w, r)
	if err != nil {
		return
	}

	// Chama a função de service para listar os eventos
	events, err := services.GetEvents(user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Retorna a lista de eventos
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(events)
}

// Função para buscar um evento específico
func GetEvent(w http.ResponseWriter, r *http.Request) {
	// Verifica se o usuário está autenticado
	user, err := services.VerifyToken(w, r)
	if err != nil {
		return
	}

	if(user.Email != ""){}
	// Extrai o ID do evento da URL
	vars := mux.Vars(r)
	eventID, err := uuid.Parse(vars["eventID"])
	if err != nil {
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}

	// Chama a função de serviço para obter o evento
	event, err := services.GetEvent(eventID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Retorna o evento encontrado
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(event)
}


// Função para atualizar um evento
func UpdateEvent(w http.ResponseWriter, r *http.Request) {
	// Verifica se o usuário está autenticado
	user, err := services.VerifyToken(w, r)
	if err != nil {
		return
	}

	// Extrai o ID do evento da URL
	vars := mux.Vars(r)
	eventID, err := uuid.Parse(vars["id"])
	if err != nil {
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}

	// Parse do corpo da requisição
	var eventRequest struct {
		Name        string    `json:"name"`
		Description string    `json:"description"`
		Location    string    `json:"location"`
		Date        time.Time `json:"date"`
	}
	if err := json.NewDecoder(r.Body).Decode(&eventRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Chama a função de service para atualizar o evento
	event, err := services.UpdateEvent(eventID, eventRequest.Name, eventRequest.Description, eventRequest.Location, eventRequest.Date, user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Retorna o evento atualizado
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(event)
}

// Função para deletar um evento
func DeleteEvent(w http.ResponseWriter, r *http.Request) {
	// Verifica se o usuário está autenticado
	user, err := services.VerifyToken(w, r)
	if err != nil {
		return
	}

	// Extrai o ID do evento da URL
	vars := mux.Vars(r)
	eventID, err := uuid.Parse(vars["id"])
	if err != nil {
		http.Error(w, "Invalid event ID", http.StatusBadRequest)
		return
	}

	// Chama a função de service para deletar o evento
	if err := services.DeleteEvent(eventID, user.ID); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Retorna sucesso
	w.WriteHeader(http.StatusNoContent)
}
