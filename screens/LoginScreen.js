import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { login } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await login(username, password);
      navigation.replace('Home');
    } catch (error) {
      let message = 'Identifiants incorrects ou serveur indisponible';
      if (error.response) {
        const data = error.response.data;
        if (data.detail) message = data.detail;
        else if (data.error) message = data.error;
        else if (typeof data === 'string') message = data;
        else message = JSON.stringify(data);
      } else if (error.request) {
        message = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
      } else {
        message = error.message;
      }
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BudgetFlow</Text>
      <TextInput
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title={loading ? "Connexion..." : "Se connecter"} onPress={handleLogin} disabled={loading} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Créer un compte</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 8 },
  link: { marginTop: 15, color: '#1f5e4c', textAlign: 'center', fontWeight: '600' },
});