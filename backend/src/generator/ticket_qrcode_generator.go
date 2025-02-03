package generator

import (
	"bytes"
	"encoding/base64"
	"image"
	"image/color"
	"image/draw"
	"image/png"

	"github.com/boombuler/barcode"
	"github.com/boombuler/barcode/qr"
)

// Função para gerar um QR Code com cores personalizadas
func GenerateNeonQRCode(ticketToken string) (string, error) {
	// Criar o QR Code
	qrCode, err := qr.Encode(ticketToken, qr.M, qr.Auto)
	if err != nil {
		return "", err
	}

	// Redimensionar para 256x256
	qrCode, err = barcode.Scale(qrCode, 256, 256)
	if err != nil {
		return "", err
	}

	// Criar um novo canvas com fundo escuro
	img := image.NewRGBA(qrCode.Bounds())
	neonColor := color.RGBA{0, 255, 204, 255} // Cor Neon (#00FFCC)
	bgColor := color.RGBA{15, 23, 42, 255}   // Fundo escuro (#0F172A)

	// Preencher o fundo
	draw.Draw(img, img.Bounds(), &image.Uniform{C: bgColor}, image.Point{}, draw.Src)

	// Aplicar a cor neon ao QR Code
	for x := 0; x < qrCode.Bounds().Dx(); x++ {
		for y := 0; y < qrCode.Bounds().Dy(); y++ {
			if qrCode.At(x, y) == color.Black {
				img.Set(x, y, neonColor)
			}
		}
	}

	// Criar buffer para armazenar a imagem
	var buf bytes.Buffer

	// Salvar como PNG
	err = png.Encode(&buf, img)
	if err != nil {
		return "", err
	}

	// Converter para base64
	qrCodeBase64 := base64.StdEncoding.EncodeToString(buf.Bytes())

	return qrCodeBase64, nil
}
