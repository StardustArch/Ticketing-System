import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config/config'; // Importe a configuração

// Função para verificar se o usuário está logado
export const isLoggedIn = async () => {
  console.log('🔵 Iniciando verificação de login...');
  const token = await AsyncStorage.getItem('userToken');
  console.log('🟡 Token encontrado:', token);
  return token !== null; // Se houver um token armazenado, o usuário está logado
};

// Função para fazer login
export const login = async (email: string, password: string) => {
  console.log('🔵 Iniciando login...');
  console.log('🟡 Dados de login recebidos - Email:', email, 'Senha:', password);

  try {
    console.log('📡 Enviando requisição para /login...');
    const response = await fetch(config.apiUrl + '/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    console.log('📩 Resposta do servidor:', response.status, response.statusText);
    if (!response.ok) {
      console.error('❌ Erro no login:', response.status);
      throw new Error(`Login failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Dados de login recebidos:', data);

    if (data.token) {
      console.log('🟢 Token recebido. Armazenando...');
      await AsyncStorage.setItem('userToken', data.token); // Armazena o token
      console.log('🟢 Armazenando papel (role) do usuário...');
      await AsyncStorage.setItem('userRole', data.user.Role); // Armazena o papel (role)
      console.log('🟢 Armazenando ID do usuário...');
      await AsyncStorage.setItem('userId', data.user.ID); // Armazena o ID do usuário
    }

    return data;
  } catch (error) {
    console.error('❌ Erro ao tentar fazer login:', error);
    throw error;
  }
};

// Função para logout
export const logout = async () => {
  console.log('🔵 Iniciando logout...');
  await AsyncStorage.removeItem('userToken'); // Remove o token no logout
  console.log('🟡 Token removido do AsyncStorage.');
};

// Função de registro
export const register = async (name: string, email: string, password: string, role: string) => {
  console.log('🔵 Iniciando registro...', { name, email, password, role });

  try {
    console.log('📡 Enviando requisição para /register...');
    const response = await fetch(config.apiUrl + '/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

    console.log('📩 Resposta do servidor:', response.status, response.statusText);
    if (!response.ok) {
      console.error('❌ Erro no registro:', response.status);
      throw new Error(`Registration failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Usuário registrado:', data);

    return data; // Retorna o usuário registrado
  } catch (error) {
    console.error('❌ Erro ao tentar registrar o usuário:', error);
    throw error;
  }
};