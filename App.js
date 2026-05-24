import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import des écrans
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';

const Stack = createStackNavigator();

// Configuration du linking pour que les URL de réinitialisation fonctionnent
const linking = {
  prefixes: [
    'http://localhost:8081',  // développement web
    'http://127.0.0.1:8081',
    'exp://localhost:8081',   // Expo Go (mobile)
    'budgetflow://',           // schéma personnalisé pour mobile
  ],
  config: {
    screens: {
      Login: 'Login',
      Home: 'Home',
      Register: 'Register',
      ForgotPassword: 'ForgotPassword',
      ResetPassword: 'ResetPassword',   // correspond à l'écran qui gère /ResetPassword?uid=...
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Connexion' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'BudgetFlow', headerLeft: null }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Créer un compte' }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ title: 'Mot de passe oublié' }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ title: 'Nouveau mot de passe' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}