import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/config'; // Importa a configuração de URL da API

// Função para obter os tickets de um comprador logado
export const getTickets = async () => {
  console.log('🔵 Iniciando getTickets...');

  const token = await AsyncStorage.getItem('userToken'); // Recupera o token do comprador
  console.log('🟡 Token obtido:', token);

  if (!token) {
    console.error('❌ Erro: Usuário não autenticado.');
    throw new Error('User is not authenticated');
  }

  try {
    console.log('📡 Enviando requisição para /tickets...');
    const response = await fetch(config.apiUrl + '/tickets', { // Ajuste a rota conforme necessário
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Envia o token no cabeçalho
        'ngrok-skip-browser-warning': 'true',
      },
    });

    console.log('📩 Resposta do servidor:', response.status, response.statusText);

    if (!response.ok) {
      console.error('❌ Erro na requisição:', response.status);
      throw new Error('Failed to fetch tickets');
    }

    const data = await response.json();
    console.log('✅ Tickets recebidos:', data);

    return data;
  } catch (error) {
    console.error('❌ Erro ao buscar tickets:', error);
    throw error;
  }
};

// Função para criar um novo ticket
export const createTicket = async (ticketData: any) => {
  console.log('🔵 Iniciando createTicket...');

  const token = await AsyncStorage.getItem('userToken'); // Recupera o token do comprador
  console.log('🟡 Token obtido:', token);

  if (!token) {
    console.error('❌ Erro: Usuário não autenticado.');
    throw new Error('User is not authenticated');
  }

  try {
    console.log('📡 Enviando requisição para /tickets...');
    const response = await fetch(config.apiUrl + '/tickets', { // Ajuste a rota conforme necessário
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Envia o token no cabeçalho
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(ticketData),
    });

    console.log('📩 Resposta do servidor:', response.status, response.statusText);

    if (!response.ok) {
      console.error('❌ Erro ao criar ticket:', response.status);
      throw new Error('Failed to create ticket');
    }

    const data = await response.json();
    console.log('✅ Ticket criado com sucesso:', data);

    return data;
  } catch (error) {
    console.error('❌ Erro ao criar ticket:', error);
    throw error;
  }
};
