import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Importando ícones
import Entypo from '@expo/vector-icons/Entypo';

// Telas
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Events from './src/screens/EventList';
import Profile from './src/screens/Profile';
import BuyerEvents from './src/screens/buyer/BuyerEvents'; // Tela do comprador com eventos
import BuyerTickets from './src/screens/buyer/BuyerTickets'; // Tela do comprador com tickets
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criar o Stack Navigator
const Stack = createStackNavigator();

// Criar o Bottom Tab Navigator
const Tab = createBottomTabNavigator();
const BuyerTab = createBottomTabNavigator();

// Função para redirecionar baseado no papel do usuário
const getInitialRoute = async () => {
  const userRole = await AsyncStorage.getItem('userRole');
  if (userRole === 'buyer') {
    return 'BuyerTabs';  // Redireciona para as tabs do comprador
  }
  return 'Tabs'; // Caso contrário, vai para as tabs do organizador
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Eventos') {
            iconName = 'event';
          } else if (route.name === 'Perfil') {
            iconName = 'person';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00ffcc', // Cor ativa
        tabBarInactiveTintColor: 'gray',  // Cor inativa
        tabBarStyle: {
          backgroundColor: '#121212', // Cor do fundo das tabs
        },

      })}
    >
      <Tab.Screen name="Eventos" component={Events} />
      <Tab.Screen name="Perfil" component={Profile} />
    </Tab.Navigator>
  );
}

function BuyerTabs() {
  return (
    <BuyerTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00ffcc', // Cor ativa
        tabBarInactiveTintColor: 'gray',  // Cor inativa
        tabBarStyle: {
          backgroundColor: '#121212', // Cor do fundo das tabs
        },
      }}
    >
      <BuyerTab.Screen
        name="Eventos"
        component={BuyerEvents}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event" size={size} color={color} />
          ),
        }}
      />
      <BuyerTab.Screen
        name="Meus Tickets"
        component={BuyerTickets}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="ticket" size={size} color={color} />
          ),
        }}
      />
      <BuyerTab.Screen
        name="Meu Perfil"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </BuyerTab.Navigator>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string>('Login');

  useEffect(() => {
    const determineRoute = async () => {
      const route = await getInitialRoute();
      setInitialRoute(route); // Atualiza a rota inicial dependendo do papel do usuário
    };

    determineRoute();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="BuyerTabs" component={BuyerTabs} />
      </Stack.Navigator>
      <StatusBar style="dark" backgroundColor='#00ffcc' />
    </NavigationContainer>
  );
}
