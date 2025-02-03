import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { register } from '../services/authService';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons'; // Importando ícones
import { RootStackParamList } from '../types';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar visibilidade da senha
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleRegister = async () => {
    try {
      await register(name, email, password, role);
      Alert.alert('Sucesso!', 'Registro concluído. Faça login.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Falha no registro. Tente novamente.');
    }
  };

  return (
    <LinearGradient colors={['#0f172a', '#23425c']} style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Criar Conta</Text>

        <TextInput
          label="Nome"
          value={name}
          onChangeText={setName}
          textColor="#00ffcc"
          theme={{ colors: { primary: '#00ffcc' } }}
          style={styles.input}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          textColor="#00ffcc"
          theme={{ colors: { primary: '#00ffcc' } }}
          style={styles.input}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword} // Controla a visibilidade da senha
            textColor="#00ffcc"
            theme={{ colors: { primary: '#00ffcc' } }}
            style={styles.input}
          />
          <MaterialIcons
            name={showPassword ? 'visibility' : 'visibility-off'} // Ícone de olho
            size={24}
            color="#00ffcc"
            onPress={() => setShowPassword(!showPassword)} // Alterna a visibilidade
            style={styles.eyeIcon}
          />
        </View>

        <Text style={styles.roleLabel}>Escolha seu tipo de conta:</Text>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
          dropdownIconColor="#00ffcc"
        >
          <Picker.Item label="Comprador" value="buyer" />
          <Picker.Item label="Organizador" value="organizer" />
        </Picker>

        <Button mode="contained" onPress={handleRegister} style={styles.button} labelStyle={styles.buttonText}>
          Cadastrar
        </Button>

        <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
          Já tem uma conta? <Text style={styles.loginLink}>Faça login</Text>
        </Text>
      </View>
    </LinearGradient>
  );
};

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
    fontSize: 28,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
  },
  roleLabel: {
    color: '#ffffff',
    marginBottom: 5,
    fontSize: 16,
  },
  picker: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#00ffcc',
    borderColor: '#00ffcc',
    borderWidth: 1,
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
  loginText: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 15,
  },
  loginLink: {
    color: '#00ffcc',
    fontWeight: 'bold',
  },
});

export default Register;
