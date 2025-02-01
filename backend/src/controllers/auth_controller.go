package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"src/database"
	"src/services"
)

// Função para registrar um novo usuário
func RegisterUser(w http.ResponseWriter, r *http.Request) {
	var requestBody struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}

	// Decodifica o corpo da requisição
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Registra o usuário utilizando o serviço
	user, err := services.RegisterUser(requestBody.Name, requestBody.Email, requestBody.Password, requestBody.Role)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Retorna o usuário registrado
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

// Função para autenticar um usuário e gerar o token
func LoginUser(w http.ResponseWriter, r *http.Request) {
	var requestBody struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// Decodifica o corpo da requisição
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	// Realiza o login e gera o token
	token, user, err := services.LoginUser(requestBody.Email, requestBody.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// Retorna o token e os dados do usuário
	response := struct {
		Token string        `json:"token"`
		User  database.User `json:"user"`
	}{
		Token: token,
		User:  *user,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}


func HelloHandler(w http.ResponseWriter, r *http.Request) {
	// Verifica o token e recupera o usuário
	user, err := services.VerifyToken(w, r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Retorna uma saudação com o nome do usuário logado
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, `{"message": "Olá, %s!"}`, user.Name)
}