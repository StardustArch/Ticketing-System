import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para verificar se o usuário está logado
export const isLoggedIn = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return token !== null; // Se houver um token armazenado, o usuário está logado
};

// Função para fazer login
export const login = async (email: string, password: string) => {
  try {
    // Envia a requisição para o backend
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    // Converte a resposta em JSON
    const data = await response.json();

    // Verifica se o token foi retornado
    if (data.token) {
      await AsyncStorage.setItem('userToken', data.token); // Armazena o token no AsyncStorage
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Re-throwing error for further handling in the component
  }
};

// Função para logout
export const logout = async () => {
  await AsyncStorage.removeItem('userToken'); // Remove o token no logout
};
