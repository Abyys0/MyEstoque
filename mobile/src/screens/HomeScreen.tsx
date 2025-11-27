import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao MyStock</Text>
      <Text style={styles.subtitle}>
        Sistema de Controle de Estoque com Leitura de Códigos de Barras
      </Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>150</Text>
          <Text style={styles.statLabel}>Produtos</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>1,250</Text>
          <Text style={styles.statLabel}>Itens</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>R$ 50k</Text>
          <Text style={styles.statLabel}>Valor</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});
