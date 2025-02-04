package services

import (
	"crypto/md5"
	"encoding/hex"
	"errors"
	"src/database"
	"src/generator"

	"github.com/google/uuid"
)

// Função para gerar o hash MD5 do QR Code
func generateQRCodeHash(qrCode string) string {
	hash := md5.Sum([]byte(qrCode))
	return hex.EncodeToString(hash[:])
}

// Função para criar um ticket
func CreateTicket(eventID uuid.UUID, userID uuid.UUID) (*database.Ticket, error) {
	// Buscar o evento no banco de dados
	var event database.Event
	if err := database.DB.First(&event, "id = ?", eventID).Error; err != nil {
		return nil, errors.New("evento não encontrado")
	}

	// Buscar o usuário no banco de dados
	var user database.User
	if err := database.DB.First(&user, "id = ?", userID).Error; err != nil {
		return nil, errors.New("usuário não encontrado")
	}

	// Gerar um ID único para o ticket
	ticketID := uuid.New()

	// Gerar o token JWT para o ticket
	token, err := generator.GenerateTicketToken(ticketID, eventID, userID)
	if err != nil {
		return nil, errors.New("erro ao gerar token do ticket")
	}

	// Gerar o hash MD5 do QR Code

	// Criar o ticket no banco de dados com os objetos de `User` e `Event`
	ticket := database.Ticket{
		ID:         ticketID,
		EventID:    eventID,
		Event:      event,  // Atribuir o evento
		UserID:     userID,
		User:       user,   // Atribuir o usuário
		Token:      token,
		Status:     "valido",
	}

	// Salvar no banco de dados
	if err := database.DB.Create(&ticket).Error; err != nil {
		return nil, err
	}

	return &ticket, nil
}

// Função para listar tickets de um usuário
func GetTicketsByUser(userID uuid.UUID) ([]database.Ticket, error) {
	var tickets []database.Ticket

	// Fazendo JOIN para carregar os detalhes do evento, organizador do evento e do usuário
	err := database.DB.
		Preload("Event").               // Carrega os detalhes do evento relacionado
		Preload("Event.Organizer").     // Carrega o organizador do evento
		Preload("User").                // Carrega os detalhes do usuário relacionado
		Where("user_id = ?", userID).
		Find(&tickets).Error

	if err != nil {
		return nil, err
	}

	return tickets, nil
}



// Função para listar tickets de um evento
func GetTicketsByEvent(eventID uuid.UUID) ([]database.Ticket, error) {
	var tickets []database.Ticket

	// JOINs para trazer informações completas
	err := database.DB.
		Preload("Event").
		Preload("Event.Organizer").     // Carrega o organizador do evento
		Preload("User").
		Where("event_id = ?", eventID).
		Find(&tickets).Error

	if err != nil {
		return nil, err
	}

	return tickets, nil
}

