package database

import (
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Variável global para conexão com o banco
var DB *gorm.DB

// InitDB inicializa a conexão e roda as migrações
func InitDB() {
	dsn := "host=postgres user=admin password=admin dbname=ticketing port=5432 sslmode=disable"
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Erro ao conectar ao banco:", err)
	}
	fmt.Println("Banco conectado com sucesso!")

	// Rodar migrações automaticamente
	err = DB.AutoMigrate(&User{}, &Event{}, &Ticket{}, &Payment{})
	if err != nil {
		log.Fatal("Erro ao migrar tabelas:", err)
	}
	fmt.Println("Migração concluída com sucesso!")
}
