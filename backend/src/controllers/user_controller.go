package controllers

import (
	"encoding/json"
	"net/http"
	"src/services"
)

// Função para atualizar as informações do usuário
func UpdateUser(w http.ResponseWriter, r *http.Request) {
	// Verifica se o usuário está autenticado
	user, err := services.VerifyToken(w, r)
	if err != nil {
		return
	}

	// Parse do corpo da requisição
	var userRequest struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	if err := json.NewDecoder(r.Body).Decode(&userRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Chama a função de serviço para atualizar o usuário
	updatedUser, err := services.UpdateUser(user.ID, userRequest.Name, userRequest.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Retorna o usuário atualizado
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedUser)
}


func ChangePassword(w http.ResponseWriter, r *http.Request) {
	// Verifica se o usuário está autenticado
	user, err := services.VerifyToken(w, r)
	if err != nil {
		return
	}

	// Parse do corpo da requisição
	var passwordRequest struct {
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&passwordRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Chama a função de serviço para alterar a senha
	err = services.ChangePassword(user.ID, passwordRequest.OldPassword, passwordRequest.NewPassword)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Responde com sucesso
	w.WriteHeader(http.StatusNoContent)
}


// Função para obter todas as informações do usuário autenticado
func GetUserInfo(w http.ResponseWriter, r *http.Request) {
	// Verifica se o usuário está autenticado
	user, err := services.VerifyToken(w, r)
	if err != nil {
		return
	}

	// Retorna as informações do usuário
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}