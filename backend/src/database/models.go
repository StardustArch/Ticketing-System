package database

import (
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// Modelo de Usuário
type User struct {
	ID       uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name     string    `gorm:"not null"`
	Email    string    `gorm:"unique;not null"`
	Password string    `gorm:"not null"`
	Role     string    `gorm:"not null;check:role IN ('buyer', 'organizer')"`
}


// Função para gerar o hash da senha
func (user *User) SetPassword(password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	return nil
}

// Função para verificar a senha
func (user *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	return err == nil
}


// Modelo de Evento
type Event struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name        string    `gorm:"not null"`
	Description string
	Date        time.Time `gorm:"not null"`
	Location    string    `gorm:"not null"`
	OrganizerID uuid.UUID `gorm:"type:uuid;not null"`
	Organizer   User      `gorm:"foreignKey:OrganizerID;constraint:OnDelete:CASCADE"`
}

// Modelo de Ticket
type Ticket struct {
	ID            uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	EventID       uuid.UUID `gorm:"type:uuid;not null"`
	Event         Event     `gorm:"foreignKey:EventID;constraint:OnDelete:CASCADE"`
	UserID        uuid.UUID `gorm:"type:uuid;not null"`
	User          User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	QRCode        string    `gorm:"not null"`
	QRCodeHash    string    `gorm:"unique;not null"` // Armazenando o hash MD5 do QR Code
	Token         string    `gorm:"unique;not null"`
	Status        string    `gorm:"not null;check:status IN ('valido', 'usado', 'cancelado');default:'valido'"`
}


// Modelo de Pagamento
type Payment struct {
	ID                 uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	TicketID           uuid.UUID `gorm:"type:uuid;not null"`
	Ticket             Ticket    `gorm:"foreignKey:TicketID;constraint:OnDelete:CASCADE"`
	UserID             uuid.UUID `gorm:"type:uuid;not null"`
	User               User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
	Amount             float64   `gorm:"not null"`
	Status             string    `gorm:"not null;check:status IN ('pendente', 'pago');default:'pendente'"`
	MpesaTransactionID *string   `gorm:"unique"`
}
