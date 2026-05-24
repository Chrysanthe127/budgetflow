import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from 'react-native';
import { getTransactions, createTransaction, deleteTransaction, getStats } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [description, setDescription] = useState('');
  const [montant, setMontant] = useState('');
  const [type, setType] = useState('depense'); // 'depense' ou 'revenu'
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ total_revenus: 0, total_depenses: 0, solde: 0 });

  const loadData = async () => {
    try {
      const [transRes, statsRes] = await Promise.all([getTransactions(), getStats()]);
      setTransactions(transRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("loadData error", error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    }
  };

  const handleAdd = async () => {
    if (!description.trim() || !montant) {
      Alert.alert('Erreur', 'Description et montant requis');
      return;
    }
    const montantNum = parseFloat(montant);
    if (isNaN(montantNum) || montantNum <= 0) {
      Alert.alert('Erreur', 'Montant invalide');
      return;
    }
    try {
      await createTransaction({ description: description.trim(), montant: montantNum, type });
      loadData();
      setDescription('');
      setMontant('');
    } catch (error) {
      console.error("handleAdd error", error);
      Alert.alert('Erreur', 'Ajout impossible');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      loadData();
    } catch (error) {
      console.error("handleDelete error", error);
      Alert.alert('Erreur', 'Suppression impossible');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigation.replace('Login');
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      {/* En-tête avec déconnexion */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BudgetFlow</Text>
        <Button title="Déconnexion" onPress={handleLogout} color="#e26d5c" />
      </View>

      {/* Formulaire d'ajout */}
      <View style={styles.form}>
        <TextInput
          placeholder="Description (ex: Café, Salaire)"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <TextInput
          placeholder="Montant (fbu)"
          keyboardType="numeric"
          value={montant}
          onChangeText={setMontant}
          style={styles.input}
        />
        <View style={styles.typeSelector}>
          <Button
            title="💸 Dépense"
            onPress={() => setType('depense')}
            color={type === 'depense' ? '#e26d5c' : '#aaa'}
          />
          <Button
            title="💰 Revenu"
            onPress={() => setType('revenu')}
            color={type === 'revenu' ? '#2c9b77' : '#aaa'}
          />
        </View>
        <Button title="➕ Ajouter" onPress={handleAdd} />
      </View>

      {/* Statistiques : totaux séparés */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>💰 TOTAL REVENUS</Text>
          <Text style={[styles.statValue, { color: '#2c9b77' }]}>{stats.total_revenus.toFixed(2)} fbu</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>📉 TOTAL DÉPENSES</Text>

          <Text style={[styles.statValue, { color: '#e26d5c' }]}>{stats.total_depenses.toFixed(2)} fbu</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>⚖️ SOLDE</Text>
          <Text style={[styles.statValue, { color: stats.solde >= 0 ? '#2c9b77' : '#e26d5c' }]}>{stats.solde.toFixed(2)} fbu</Text>
        </View>
      </View>

      {/* Liste des transactions */}
      <FlatList
        data={transactions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View>
              <Text style={styles.transactionDesc}>{item.description}</Text>
              <Text style={styles.transactionDate}>{new Date(item.date).toLocaleString()}</Text>
            </View>
            <Text style={[styles.transactionAmount, { color: item.type === 'revenu' ? '#2c9b77' : '#e26d5c' }]}>
              {item.type === 'revenu' ? '+' : '-'} {item.montant} fbu
            </Text>
            <Button title="X" onPress={() => handleDelete(item.id)} color="#e26d5c" />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1f5e4c' },
  form: { marginBottom: 20 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 10 },
  typeSelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 12, alignItems: 'center', marginHorizontal: 4 },
  statLabel: { fontSize: 12, fontWeight: 'bold', color: '#555' },
  statValue: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 8 },
  transactionDesc: { fontWeight: 'bold' },
  transactionDate: { fontSize: 10, color: '#888' },
  transactionAmount: { fontSize: 16, fontWeight: 'bold' },
});