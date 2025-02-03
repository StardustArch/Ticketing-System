import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/config'; // Importe a configuração

// Função para obter eventos do organizador logado
export const getEvents = async () => {
  console.log('🔵 Iniciando getEvents...');

  const token = await AsyncStorage.getItem('userToken'); // Recupera o token do organizador
  console.log('🟡 Token obtido:', token);

  if (!token) {
    console.error('❌ Erro: Usuário não autenticado.');
    throw new Error('User is not authenticated');
  }

  try {
    console.log('📡 Enviando requisição para /events...');
    const response = await fetch(config.apiUrl+'/events', { // Ajuste a rota conforme necessário
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
      throw new Error('Failed to fetch events');
    }

    const data = await response.json();
    console.log('✅ Eventos recebidos:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Erro ao buscar eventos:', error);
    throw error;
  }
};

// **Adicionar um novo evento**
export const addEvent = async (event: { Name: string; Date: string; Location: string; Description: string }) => {
    console.log('🔵 Iniciando addEvent...');
  
    const token = await AsyncStorage.getItem('userToken'); // Recupera o token do organizador
    console.log('🟡 Token obtido:', token);
  
    if (!token) {
      console.error('❌ Erro: Usuário não autenticado.');
      throw new Error('User is not authenticated');
    }
  
    try {
      console.log('📡 Enviando requisição para /events...');
      const response = await fetch(config.apiUrl+'/events', { // Ajuste a rota conforme necessário
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Envia o token no cabeçalho
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(event),
      });
  
      console.log('📩 Resposta do servidor:', response.status, response.statusText);
  
      if (!response.ok) {
        console.error('❌ Erro ao adicionar evento:', response.status);
        throw new Error('Failed to add event');
      }
  
      const data = await response.json();
      console.log('✅ Evento adicionado com sucesso:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Erro ao adicionar evento:', error);
      throw error;
    }
  };


// **Atualizar evento**
export const updateEvent = async (eventID: string, updatedData: { Name?: string; Date?: string; Location?: string; Description?: string }) => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) throw new Error('User not authenticated');

  const response = await fetch(`${config.apiUrl}/events/${eventID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) throw new Error('Failed to update event');
  return response.json();
};

// **Deletar evento**
export const deleteEvent = async (eventID: string) => {
  const token = await AsyncStorage.getItem('userToken');
  if (!token) throw new Error('User not authenticated');

  const response = await fetch(`${config.apiUrl}/events/${eventID}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    },
  });

  if (!response.ok) throw new Error('Failed to delete event');
  return true;
};
// Função para buscar eventos futuros
export const getFutureEvents = async () => {
  console.log('🔵 Iniciando getFutureEvents...');

  const token = await AsyncStorage.getItem('userToken'); // Recupera o token do usuário
  console.log('🟡 Token obtido:', token);

  if (!token) {
    console.error('❌ Erro: Usuário não autenticado.');
    throw new Error('User is not authenticated');
  }

  try {
    console.log('📡 Enviando requisição para /events/future...');
    const response = await fetch(config.apiUrl + '/events/future', { // Ajuste a rota conforme necessário
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
      throw new Error('Failed to fetch future events');
    }

    const data = await response.json();
    console.log('✅ Eventos futuros recebidos:', data);

    return data;
  } catch (error) {
    console.error('❌ Erro ao buscar eventos futuros:', error);
    throw error;
  }
};
