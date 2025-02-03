package generator

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
)

// 🔥 Definição direta da chave secreta para testes
var jwtSecret = []byte("869687084")

// Estrutura do Payload do Token
type TicketClaims struct {
	TicketID uuid.UUID `json:"ticket_id"`
	EventID  uuid.UUID `json:"event_id"`
	UserID   uuid.UUID `json:"user_id"`
	Status   string    `json:"status"`
	jwt.StandardClaims
}

// Função para gerar o token JWT do ticket
func GenerateTicketToken(ticketID, eventID, userID uuid.UUID) (string, error) {
	claims := TicketClaims{
		TicketID: ticketID,
		EventID:  eventID,
		UserID:   userID,
		Status:   "valido",
		StandardClaims: jwt.StandardClaims{
			IssuedAt: time.Now().Unix(),
		},
	}

	// Criando o token JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Assinando o token com a chave secreta fixa
	signedToken, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}
