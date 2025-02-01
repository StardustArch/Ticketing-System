import AsyncStorage from '@react-native-async-storage/async-storage';

// **Função para obter as informações do usuário**
export const getUserProfile = async () => {
  console.log('🔵 Iniciando getUserProfile...');

  const token = await AsyncStorage.getItem('userToken'); // Recupera o token
  console.log('🟡 Token obtido:', token);

  if (!token) {
    console.error('❌ Erro: Usuário não autenticado.');
    throw new Error('User is not authenticated');
  }

  try {
    console.log('📡 Enviando requisição para /user...');
    const response = await fetch('http://localhost:8080/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('📩 Resposta do servidor:', response.status, response.statusText);

    if (!response.ok) {
      console.error('❌ Erro na requisição:', response.status);
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    console.log('✅ Dados do usuário recebidos:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Erro ao buscar perfil:', error);
    throw error;
  }
};

// **Função para atualizar o perfil do usuário (Nome e Email)**
export const updateUserProfile = async (updatedData: { Name: string; Email: string }) => {
  console.log('🔵 Iniciando updateUserProfile...', updatedData);

  const token = await AsyncStorage.getItem('userToken'); // Recupera o token
  console.log('🟡 Token obtido:', token);

  if (!token) {
    console.error('❌ Erro: Usuário não autenticado.');
    throw new Error('User is not authenticated');
  }

  try {
    console.log('📡 Enviando requisição para atualizar perfil...');
    const response = await fetch('http://localhost:8080/user', { // Substitua pela sua rota de atualização
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    console.log('📩 Resposta do servidor:', response.status, response.statusText);

    if (!response.ok) {
      console.error('❌ Erro na atualização:', response.status);
      throw new Error('Failed to update user profile');
    }

    const data = await response.json();
    console.log('✅ Perfil atualizado com sucesso:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Erro ao atualizar perfil:', error);
    throw error;
  }
};

// **Função para alterar a senha do usuário**
export const updatePassword = async (newPassword: string) => {
  console.log('🔵 Iniciando updatePassword...');

  const token = await AsyncStorage.getItem('userToken'); // Recupera o token
  console.log('🟡 Token obtido:', token);

  if (!token) {
    console.error('❌ Erro: Usuário não autenticado.');
    throw new Error('User is not authenticated');
  }

  try {
    console.log('📡 Enviando requisição para atualizar senha...');
    const response = await fetch('http://localhost:8080/user/password', { // Substitua pela sua rota de alteração de senha
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ password: newPassword }),
    });

    console.log('📩 Resposta do servidor:', response.status, response.statusText);

    if (!response.ok) {
      console.error('❌ Erro na alteração de senha:', response.status);
      throw new Error('Failed to update password');
    }

    console.log('✅ Senha alterada com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao alterar senha:', error);
    throw error;
  }
};
