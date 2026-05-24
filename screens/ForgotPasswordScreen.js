import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { forgotPassword } from '../services/api';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleSend = async () => {
    if (!email) {
      Alert.alert('Erreur', 'Email requis');
      return;
    }
    try {
      const data = await forgotPassword(email);
      Alert.alert('Lien', data.reset_link || 'Vérifiez votre console Django');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erreur', 'Échec de l\'envoi');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mot de passe oublié</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <Button title="Envoyer" onPress={handleSend} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 10, padding: 8 },
  link: { marginTop: 15, color: '#1f5e4c', textAlign: 'center' },
});