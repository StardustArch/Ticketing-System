import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';

// Telas
import Login from './src/screens/Login';
// import Register from './src/screens/Register';
import Events from './src/screens/EventList';
import Profile from './src/screens/Profile';

// Criar o Stack Navigator
const Stack = createStackNavigator();

// Criar o Bottom Tab Navigator
const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Events" component={Events} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Rota de login */}
        <Stack.Screen name="Login" component={Login} />
        {/* <Stack.Screen name="Register" component={Register} /> */}
        {/* Rota de tabs, que será acessada após o login */}
        <Stack.Screen name="Tabs" component={Tabs} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
