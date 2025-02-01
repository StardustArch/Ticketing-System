import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons'; // Ícones modernos
import { LinearGradient } from 'expo-linear-gradient';
import { getUserProfile, updateUserProfile, updatePassword } from '../services/userService';

const Profile = () => {
  const [user, setUser] = useState<{ Name: string; Email: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log('🔵 fetchUserProfile iniciado...');
      try {
        const data = await getUserProfile();
        console.log('✅ fetchUserProfile sucesso:', data);
        setUser(data);
        setNewName(data.Name);
        setNewEmail(data.Email);
      } catch (err) {
        setError('Erro ao carregar dados do usuário');
        console.error('❌ fetchUserProfile erro:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile({ Name: newName, Email: newEmail });
      setUser({ Name: newName, Email: newEmail });
      setEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (err) {
      Alert.alert('Erro', 'Falha ao atualizar perfil.');
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) {
      Alert.alert('Erro', 'A senha não pode estar vazia.');
      return;
    }
    try {
      await updatePassword(newPassword);
      setNewPassword('');
      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
    } catch (err) {
      Alert.alert('Erro', 'Falha ao alterar senha.');
    }
  };

  if (loading) {
    return (
      <View>
        <center>
        <ActivityIndicator size="large" color="#00ffcc" />
        </center>      
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <center>
        <Text style={styles.errorText}>{error}</Text>
        </center>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#0f172a', '#23425c']} style={styles.container}>
      <View style={styles.innerContainer}>
        <MaterialIcons name="person" size={80} color="#00ffcc" style={styles.icon} />
        <Text style={styles.heading}>Meu Perfil</Text>

        {editing ? (
          <>
            <TextInput
              label="Nome"
              value={newName}
              onChangeText={setNewName}
              // mode="outlined"
              theme={{ colors: { primary: '#00ffcc' } }}
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={newEmail}
              onChangeText={setNewEmail}
              // mode="outlined"
              theme={{ colors: { primary: '#00ffcc' } }}
              style={styles.input}
            />
            <Button mode="contained" onPress={handleUpdateProfile} style={styles.button}>
              Salvar Alterações
            </Button>
            <Button mode="text" onPress={() => setEditing(false)} style={styles.cancelButton}>
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Text style={styles.text}>
              <MaterialIcons name="person-outline" size={18} color="#00ffcc" /> {user?.Name}
            </Text>
            <Text style={styles.text}>
              <MaterialIcons name="email" size={18} color="#00ffcc" /> {user?.Email}
            </Text>

            <Button mode="contained" onPress={() => setEditing(true)} style={styles.button}>
              Editar Perfil
            </Button>

            <TextInput
              label="Nova Senha"
              value={newPassword}
              onChangeText={setNewPassword}
              // mode="outlined"
              secureTextEntry
              theme={{ colors: { primary: '#00ffcc' } }}
              style={styles.input}
            />

            <Button mode="contained" onPress={handleChangePassword} style={styles.button}>
              Alterar Senha
            </Button>
          </>
        )}
      </View>
    </LinearGradient>
  );
};

// **Estilos neon**
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
  icon: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#00ffcc',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 255, 204, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },
  text: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
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
    marginTop: 10,
    shadowColor: '#00ffcc',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: '#00ffcc',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default Profile;
