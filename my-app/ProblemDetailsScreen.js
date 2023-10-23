import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const ProblemDetailsScreen = () => {
  const route = useRoute();
  const { problem } = route.params;
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Map')} style={styles.backButton}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        {problem ? (
          <View style={styles.problemContainer}>
            <Text style={styles.title}>Detalhes do Problema</Text>
            <Text style={styles.label}>Título:</Text>
            <Text style={styles.text}>{problem.titulo}</Text>
            <Text style={styles.label}>Descrição:</Text>
            <Text style={styles.text}>{problem.descricao}</Text>
            <Text style={styles.label}>Contador de Apoio:</Text>
            <Text style={styles.text}>{problem.contador_apoio}</Text>
            <Text style={styles.label}>Data de Criação:</Text>
            <Text style={styles.text}>{problem.data_criacao}</Text>
            <Text style={styles.label}>Nome Pessoa:</Text>
            <Text style={styles.text}>{problem['Nome Pessoa']}</Text>
            <Text style={styles.label}>Nome Orgao Responsavel:</Text>
            <Text style={styles.text}>{problem['Nome Orgao Responsavel']}</Text>
            <Text style={styles.label}>CEP:</Text>
            <Text style={styles.text}>{problem.cep}</Text>
            <Text style={styles.label}>Rua:</Text>
            <Text style={styles.text}>{problem.rua}</Text>
            <Text style={styles.label}>Número:</Text>
            <Text style={styles.text}>{problem.numero}</Text>
            <Text style={styles.label}>Bairro:</Text>
            <Text style={styles.text}>{problem.bairro}</Text>
            <Text style={styles.label}>Cidade:</Text>
            <Text style={styles.text}>{problem.cidade}</Text>
            <Text style={styles.label}>Estado:</Text>
            <Text style={styles.text}>{problem.estado}</Text>
            <Text style={styles.label}>Latitude:</Text>
            <Text style={styles.text}>{problem.latitude}</Text>
            <Text style={styles.label}>Longitude:</Text>
            <Text style={styles.text}>{problem.longitude}</Text>
          </View>
        ) : (
          <Text>Carregando...</Text>
        )}
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  problemContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  backButton: {
    marginTop: 16,
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
  },
});

export default ProblemDetailsScreen;
