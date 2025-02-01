import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient'; // Para o fundo gradiente
import { login } from '../services/authService';

// Tipagem da navegação
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tabs: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      if (response.token) {
        navigation.replace('Tabs'); // Vai para a tela principal após login
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <LinearGradient
      colors={['#0f172a', '#23425c']} // Fundo gradiente neon
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Bem-vindo!</Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          textColor='#00ffcc'
          // mode="outlined"
          theme={{ colors: { primary: '#00ffcc' } }} // Verde neon
          style={styles.input}
        />

        <TextInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          textColor='#00ffcc'
          // mode="outlined"
          secureTextEntry
          theme={{ colors: { primary: '#00ffcc' } }}
          style={styles.input}
        />

        <Button mode="contained" onPress={handleLogin} style={styles.button} labelStyle={styles.buttonText}>
          Entrar
        </Button>

        <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
          Não tem conta? <Text style={styles.registerLink}>Cadastre-se</Text>
        </Text>
      </View>
    </LinearGradient>
  );
};

// Estilos neon
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 25,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#00ffcc',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#00ffcc',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 255, 204, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  input: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderColor: '#00ffcc',
    borderWidth: 1,
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#00ffcc',
    paddingVertical: 8,
    borderRadius: 8,
    width: '100%',
    shadowColor: '#00ffcc',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 15,
  },
  registerLink: {
    color: '#00ffcc',
    fontWeight: 'bold',
  },
});

export default Login;
