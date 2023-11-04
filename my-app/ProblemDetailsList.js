import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProblemDetailsList = () => {
  const route = useRoute();
  const { problema } = route.params;
  const navigation = useNavigation();
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showResolutionContainer, setShowResolutionContainer] = useState(true);


  console.log('Informações do problema:', problema);

  

  const handleConfirmation = async (resolved) => {
    if (resolved) {
      try {
        const response = await axios.put(`${API_URL}/problema/inativa/${problema.id}`, {
          id_pessoa: loggedInUserId,
        });
  
        if (response.status === 200) {
          console.log('Problema resolvido com sucesso!');
          alert('Obrigado pelo retorno!');
        } else {
          console.error('Erro ao tentar resolver o problema:', response.data);
        }
      } catch (error) {
        console.error('Erro ao tentar resolver o problema:', error);
      }
    } else {
      // Mostrar um alerta agradecendo
      alert('Obrigado pelo retorno!');
    }
    setShowConfirmation(false);
    setShowResolutionContainer(false);

  };
    


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

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('ProblemList')} style={styles.backButton}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      {parseInt(loggedInUserId) === parseInt(problema['Id pessoa']) && problema.ativo === 1 && showResolutionContainer && (
    <View style={styles.resolutionContainer}>
        <Text style={styles.label}>Esse problema já foi resolvido?</Text>
        <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => handleConfirmation(true)} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleConfirmation(false)} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Não</Text>
            </TouchableOpacity>
        </View>
    </View>
)}

      <View style={styles.container}>
        {problema ? (
          
          <View style={styles.problemContainer}> 
            <Text style={styles.title}>Detalhes do Problema</Text>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.text}>{problema.ativo === 1 ? 'Ativo' : 'Inativo'}</Text>
            <Text style={styles.label}>Título:</Text>
            <Text style={styles.text}>{problema.titulo}</Text>
            <Text style={styles.label}>Descrição:</Text>
            <Text style={styles.text}>{problema.descricao}</Text>
            <Text style={styles.label}>Contador de Apoio:</Text>
            <Text style={styles.text}>{problema.contador_apoio}</Text>
            <Text style={styles.label}>Data de Criação:</Text>
            <Text style={styles.text}>{problema.data_criacao}</Text>
            <Text style={styles.label}>Quem criou o problema:</Text>
            <Text style={styles.text}>{problema['Nome Pessoa']}</Text>
            <Text style={styles.label}>Nome do Orgão Responsável:</Text>
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

            <View style={styles.imageContainer}>
                <Text style={styles.label}>Foto:</Text>
                <Image 
                  source={{ uri: problema.url_foto }} 
                  style={styles.image} 
                  resizeMode="contain" 
                             />
            </View>
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
  confirmButton: {
    marginTop: 16,
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginLeft: 25,
    marginBottom:25,
  },
  confirmButtonText: {
    color: '#fff',
  },
  imageContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  image: {
    aspectRatio: 1, // Mantém a proporção da imagem
    width: '100%',
    borderRadius: 8,
    marginTop: 8, 
  },
  resolutionContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
});

export default ProblemDetailsList;
