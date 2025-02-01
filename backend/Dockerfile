# Usar a imagem Arch Linux como base
FROM archlinux:latest AS builder

# Atualizar pacotes e instalar dependências necessárias
RUN pacman -Syu --noconfirm \
    && pacman -S --noconfirm \
    go \
    ca-certificates \
    curl \
    && pacman -Scc --noconfirm  # Limpeza dos pacotes para reduzir o tamanho da imagem

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar todos os arquivos do diretório src do host para o diretório de trabalho do container
COPY ./src/ ./

# Verificar se os arquivos estão no lugar correto
RUN ls -la /app

# Rodar go mod tidy para resolver dependências
RUN go mod tidy

# Verificar a versão do Go
RUN go version

# Compilar o aplicativo
RUN go build -o /app/app .

# Usar uma imagem minimalista para o runtime
FROM alpine:latest

# Instalar certificados SSL
RUN apk --no-cache add ca-certificates

# Copiar o binário compilado do estágio anterior
COPY --from=builder /app/app /usr/local/bin/

# Expôr a porta da aplicação
EXPOSE 8080

# Definir o comando para rodar a aplicação
CMD ["app"]
