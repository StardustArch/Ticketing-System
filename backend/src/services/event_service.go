package services

import (
	"fmt"
	"src/database"
	"github.com/google/uuid"
	"time"
)

// Função para criar um evento
func CreateEvent(name, description, location string, date time.Time, organizerID uuid.UUID) (*database.Event, error) {
	// Cria um novo evento
	event := database.Event{
		Name:        name,
		Description: description,
		Location:    location,
		Date:        date,
		OrganizerID: organizerID,
	}

	// Salva o evento no banco de dados
	if err := database.DB.Create(&event).Error; err != nil {
		return nil, err
	}

	return &event, nil
}

// Função para listar eventos de um organizador
func GetEvents(organizerID uuid.UUID) ([]database.Event, error) {
	var events []database.Event

	// Busca todos os eventos do organizador
	if err := database.DB.Where("organizer_id = ?", organizerID).Find(&events).Error; err != nil {
		return nil, err
	}

	return events, nil
}

// Função para buscar todos os eventos futuros
func GetFutureEvents() ([]database.Event, error) {
	var events []database.Event

	// Busca todos os eventos no banco de dados
	if err := database.DB.Find(&events).Error; err != nil {
		return nil, err
	}

	// Filtra eventos cuja data é no futuro
	var futureEvents []database.Event
	currentTime := time.Now()
	for _, event := range events {
		if event.Date.After(currentTime) {
			futureEvents = append(futureEvents, event)
		}
	}

	return futureEvents, nil
}


// Função para buscar um evento específico
func GetEvent(eventID uuid.UUID) (*database.Event, error) {
	var event database.Event

	// Busca o evento no banco de dados pelo ID
	if err := database.DB.First(&event, "id = ?", eventID).Error; err != nil {
		return nil, fmt.Errorf("event not found")
	}

	return &event, nil
}


// Função para atualizar um evento
func UpdateEvent(id uuid.UUID, name, description, location string, date time.Time, organizerID uuid.UUID) (*database.Event, error) {
	var event database.Event

	// Verifica se o evento existe
	if err := database.DB.First(&event, "id = ?", id).Error; err != nil {
		return nil, fmt.Errorf("event not found")
	}

	// Verifica se o organizador é o mesmo do evento
	if event.OrganizerID != organizerID {
		return nil, fmt.Errorf("you are not authorized to update this event")
	}

	// Atualiza os dados do evento
	event.Name = name
	event.Description = description
	event.Location = location
	event.Date = date

	// Salva as alterações no banco
	if err := database.DB.Save(&event).Error; err != nil {
		return nil, err
	}

	return &event, nil
}

// Função para deletar um evento
func DeleteEvent(id uuid.UUID, organizerID uuid.UUID) error {
	var event database.Event

	// Verifica se o evento existe
	if err := database.DB.First(&event, "id = ?", id).Error; err != nil {
		return fmt.Errorf("event not found")
	}

	// Verifica se o organizador é o mesmo do evento
	if event.OrganizerID != organizerID {
		return fmt.Errorf("you are not authorized to delete this event")
	}

	// Deleta o evento
	if err := database.DB.Delete(&event).Error; err != nil {
		return err
	}

	return nil
}
