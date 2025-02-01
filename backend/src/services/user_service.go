package services

import (
	"fmt"
	"src/database"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// Função para atualizar as informações do usuário
func UpdateUser(userID uuid.UUID, name, email string) (*database.User, error) {
	var user database.User

	// Verifica se o usuário existe
	if err := database.DB.First(&user, "id = ?", userID).Error; err != nil {
		return nil, fmt.Errorf("user not found")
	}

	// Verifica se o email já está em uso por outro usuário
	var existingUser database.User
	if err := database.DB.Where("email = ?", email).First(&existingUser).Error; err == nil && existingUser.ID != userID {
		return nil, fmt.Errorf("email is already in use")
	}

	// Atualiza os dados do usuário, mas não altera o role
	user.Name = name
	user.Email = email

	// Salva as alterações no banco
	if err := database.DB.Save(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}


func ChangePassword(userID uuid.UUID, oldPassword, newPassword string) error {
	var user database.User

	// Verifica se o usuário existe
	if err := database.DB.First(&user, "id = ?", userID).Error; err != nil {
		return fmt.Errorf("user not found")
	}

	// Verifica se a senha antiga está correta
	if !user.CheckPassword(oldPassword) {
		return fmt.Errorf("old password is incorrect")
	}

	// Criptografa a nova senha
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash new password")
	}

	// Atualiza a senha no banco de dados
	user.Password = string(hashedPassword)

	// Salva a nova senha no banco
	if err := database.DB.Save(&user).Error; err != nil {
		return err
	}

	return nil
}