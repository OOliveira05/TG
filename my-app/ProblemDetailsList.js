import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProblemDetailsList = () => {
  const route = useRoute();
  const { problema } = route.params;
  const navigation = useNavigation();
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('loggedInUserId');
      if (id !== null) {
        return id;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao obter o ID do usuário:', error);
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      const id = await getUserId();
      setLoggedInUserId(id);
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('ProblemList')} style={styles.backButton}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        {problema ? (
          <View style={styles.problemContainer}>
            <Text style={styles.title}>Detalhes do Problema</Text>
            <Text style={styles.label}>Título:</Text>
            <Text style={styles.text}>{problema.titulo}</Text>
            <Text style={styles.label}>Descrição:</Text>
            <Text style={styles.text}>{problema.descricao}</Text>
            <Text style={styles.label}>Contador de Apoio:</Text>
            <Text style={styles.text}>{problema.contador_apoio}</Text>
            <Text style={styles.label}>Data de Criação:</Text>
            <Text style={styles.text}>{problema.data_criacao}</Text>
            <Text style={styles.label}>Nome Pessoa:</Text>
            <Text style={styles.text}>{problema['Nome Pessoa']}</Text>
            <Text style={styles.label}>Nome Orgao Responsavel:</Text>
            <Text style={styles.text}>{problema['Nome Orgao Responsavel']}</Text>
            <Text style={styles.label}>CEP:</Text>
            <Text style={styles.text}>{problema.cep}</Text>
            <Text style={styles.label}>Rua:</Text>
            <Text style={styles.text}>{problema.rua}</Text>
            <Text style={styles.label}>Número:</Text>
            <Text style={styles.text}>{problema.numero}</Text>
            <Text style={styles.label}>Bairro:</Text>
            <Text style={styles.text}>{problema.bairro}</Text>
            <Text style={styles.label}>Cidade:</Text>
            <Text style={styles.text}>{problema.cidade}</Text>
            <Text style={styles.label}>Estado:</Text>
            <Text style={styles.text}>{problema.estado}</Text>
            <Text style={styles.label}>Latitude:</Text>
            <Text style={styles.text}>{problema.latitude}</Text>
            <Text style={styles.label}>Longitude:</Text>
            <Text style={styles.text}>{problema.longitude}</Text>
          
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

export default ProblemDetailsList;
