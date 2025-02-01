// import React, { useState } from 'react';
// import { TextInput, Button, View, Text } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { register } from '../services/authService'; // Supondo que você tenha uma função de registro no serviço

// const Register = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigation = useNavigation();

//   const handleRegister = async () => {
//     try {
//       await register(name, email, password); // Função fictícia de registro
//       navigation.navigate('Login');  // Redireciona para a tela de login após o registro
//     } catch (error) {
//       console.error('Registration failed', error);
//     }
//   };

//   return (
//     <View>
//       <TextInput
//         placeholder="Name"
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button title="Register" onPress={handleRegister} />
//     </View>
//   );
// };

// export default Register;
