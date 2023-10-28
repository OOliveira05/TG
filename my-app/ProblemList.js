  import React, { useState, useEffect } from 'react';
  import { TouchableOpacity, Text, View, StyleSheet, ScrollView } from 'react-native';
  import { useNavigation } from '@react-navigation/native';
  import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe o AsyncStorage
  import { CommonActions } from '@react-navigation/native';

  const ProblemList = () => {
    const navigation = useNavigation();
    const [isShowingCadastrados, setIsShowingCadastrados] = useState(true);
    const [problemas, setProblemas] = useState([]);

    const goToMapScreen = () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'Map', params: { reload: true } }
          ],
        })
      );
    };
    
    // Obtenha o ID do usuário usando AsyncStorage
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
      const fetchData = async () => {
        const userId = await getUserId(); 
        if (!userId) return; 
    
        try {
          const response = await fetch(
            isShowingCadastrados
              ? `${API_URL}/problema/pessoaReg/${userId}` 
              : `${API_URL}/problema/pessoaPont/${userId}`,
            {
              headers: {
                'Cache-Control': 'no-cache'
              }
            }
          );
          const data = await response.json();
          setProblemas(data);
        } catch (error) {
          console.error('Erro ao buscar problemas:', error);
        }
      };
    
      fetchData();
    }, [isShowingCadastrados]);

    const toggleList = () => {
      setIsShowingCadastrados(!isShowingCadastrados);
    };

    const goToProblemDetails = (problema) => {
      navigation.navigate('ProblemDetailsList', { problema });
    };

    

    return (
      <View>
        
        
        <TouchableOpacity onPress={goToMapScreen} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleList} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>
            {isShowingCadastrados ? 'Mostrar Apoiados' : 'Mostrar Cadastrados'}
          </Text>
        </TouchableOpacity>

        <ScrollView>
          {problemas.map((problema) => (
            <TouchableOpacity key={problema.id} onPress={() => goToProblemDetails(problema)}>
              <View style={styles.problemContainer}>
                <Text style={styles.problemTitle}>{problema.titulo}</Text>
                <Text>Data de Criação: {problema.data_criacao}</Text>
              
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const styles = StyleSheet.create({


    backButton: {
      marginTop: 16,
      backgroundColor: '#8A2BE2',
      padding: 10,
      borderRadius: 8,
      alignSelf: 'flex-start',
      marginLeft: 15,
    },
    backButtonText: {
      color: '#fff',
    },
    toggleButton: {
      marginTop: 16,
      backgroundColor: '#008080',
      padding: 10,
      borderRadius: 8,
      alignSelf: 'flex-start',
      marginLeft: 15,
      marginBottom: 30,
    },
    toggleButtonText: {
      color: '#fff',
    },
    problemContainer: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    problemTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  export default ProblemList;
