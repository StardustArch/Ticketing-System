package services

import (
	"github.com/google/uuid"
	"src/database"
)

// Função para criar um ticket
func CreateTicket(eventID uuid.UUID, userID uuid.UUID, qrCode string, token string) (*database.Ticket, error) {
	// Cria um novo ticket
	ticket := database.Ticket{
		EventID: eventID,
		UserID:  userID,
		QRCode:  qrCode,
		Token:   token,
		Status:  "valido", // Default: 'valido'
	}

	// Salva o ticket no banco de dados
	if err := database.DB.Create(&ticket).Error; err != nil {
		return nil, err
	}

	return &ticket, nil
}

// Função para listar tickets de um usuário
func GetTicketsByUser(userID uuid.UUID) ([]database.Ticket, error) {
	var tickets []database.Ticket

	// Busca todos os tickets do usuário
	if err := database.DB.Where("user_id = ?", userID).Find(&tickets).Error; err != nil {
		return nil, err
	}

	return tickets, nil
}

// Função para listar tickets de um evento
func GetTicketsByEvent(eventID uuid.UUID) ([]database.Ticket, error) {
	var tickets []database.Ticket

	// Busca todos os tickets do evento
	if err := database.DB.Where("event_id = ?", eventID).Find(&tickets).Error; err != nil {
		return nil, err
	}

	return tickets, nil
}
