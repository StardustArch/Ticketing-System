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
	// Gerar um ID único para o ticket
	ticketID := uuid.New()

	// Gerar o token JWT para o ticket
	token, err := generator.GenerateTicketToken(ticketID, eventID, userID)
	if err != nil {
		return nil, errors.New("erro ao gerar token do ticket")
	}

	// Gerar o QR Code do ticket baseado no token
	qrCode, err := generator.GenerateNeonQRCode(token)
	if err != nil {
		return nil, errors.New("erro ao gerar QR Code do ticket")
	}

	// Gerar o hash MD5 do QR Code
	qrCodeHash := generateQRCodeHash(qrCode)

	// Criar o ticket no banco de dados
	ticket := database.Ticket{
		ID:         ticketID,
		EventID:    eventID,
		UserID:     userID,
		QRCode:     qrCode,
		QRCodeHash: qrCodeHash, // Salvar o hash MD5
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
