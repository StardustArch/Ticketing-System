package services

import (
	"fmt"
	"net/http"
	"strings"
	"time"
	"github.com/golang-jwt/jwt/v4"
	"src/database"
)

// Função para verificar o token JWT
func VerifyToken(w http.ResponseWriter, r *http.Request) (*database.User, error) {
	// Obtém o token da autorização no cabeçalho da requisição
	tokenString := r.Header.Get("Authorization")

	// Verifica se o token tem o prefixo "Bearer "
	if !strings.HasPrefix(tokenString, "Bearer ") {
		http.Error(w, "Authorization header missing or malformed", http.StatusUnauthorized)
		return nil, fmt.Errorf("authorization header missing or malformed")
	}

	// Remove "Bearer " da string para obter o token
	tokenString = tokenString[7:]

	// Faz o parse do token JWT
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Verifica se o método de assinatura do token é correto
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("invalid signing method")
		}

		// Retorna a chave secreta para verificar a assinatura
		return []byte("your-secret-key"), nil
	})
	if err != nil {
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return nil, err
	}

	// Verifica se o token é válido e extrai as claims
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Procura o usuário no banco de dados baseado no ID (sub) do token
		var user database.User
		if err := database.DB.First(&user, "id = ?", claims["sub"]).Error; err != nil {
			http.Error(w, "User not found", http.StatusUnauthorized)
			return nil, err
		}
		return &user, nil
	}

	// Caso o token não seja válido
	http.Error(w, "Invalid token", http.StatusUnauthorized)
	return nil, fmt.Errorf("invalid token")
}

// Função para registrar um novo usuário
func RegisterUser(name, email, password, role string) (*database.User, error) {
	// Verifica se o email já está cadastrado
	var existingUser database.User
	if err := database.DB.Where("email = ?", email).First(&existingUser).Error; err == nil {
		return nil, fmt.Errorf("email already in use")
	}

	// Cria o modelo de usuário
	user := database.User{
		Name:  name,
		Email: email,
		Role:  role,
	}

	// Criptografa a senha
	if err := user.SetPassword(password); err != nil {
		return nil, err
	}

	// Salva o usuário no banco de dados
	if err := database.DB.Create(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

// Função para autenticar um usuário e gerar o token JWT
func LoginUser(email, password string) (string, *database.User, error) {
	// Busca o usuário no banco de dados
	var user database.User
	if err := database.DB.Where("email = ?", email).First(&user).Error; err != nil {
		return "", nil, fmt.Errorf("user not found")
	}

	// Verifica se a senha está correta
	if !user.CheckPassword(password) {
		return "", nil, fmt.Errorf("invalid credentials")
	}

	// Gera o token JWT
	token, err := generateJWT(&user)
	if err != nil {
		return "", nil, err
	}

	return token, &user, nil
}

// Função para gerar o token JWT
func generateJWT(user *database.User) (string, error) {
	// Define as claims (informações do token)
	claims := jwt.MapClaims{
		"sub": user.ID,               // ID do usuário
		"name": user.Name,            // Nome do usuário
		"role": user.Role,            // Função do usuário
		"exp": time.Now().Add(time.Hour * 24).Unix(), // Expiração do token (24 horas)
	}

	// Cria o token com a chave secreta
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Assina o token com a chave secreta
	secretKey := []byte("your-secret-key")
	signedToken, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}
