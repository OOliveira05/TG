// Importando os módulos necessários do React Native e outras bibliotecas
import React, { useState, useEffect  } from 'react';
import { View, TouchableOpacity, Text, StyleSheet,Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native'; // Hook de navegação
import * as Location from 'expo-location'; // Importando a biblioteca de localização do Expo
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'


// Definindo o componente funcional MapScreen
const MapScreen = () => {
  
  // Estado para controlar a interação do usuário com o mapa
  const [userInteraction, setUserInteraction] = useState(false);
  
  // Estado para armazenar a localização atual
  const [currentLocation, setCurrentLocation] = useState(null)
  
  // Estado para armazenar a região do mapa
  const [region, setRegion] = useState({
    latitude: -23.08575,
    longitude: -47.20245,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  // Novo estado para controlar o zoom
  const [zoomLevel, setZoomLevel] = useState(12);
  
  // Hook de navegação para permitir a navegação para outras telas
  const navigation = useNavigation(); 
  
  // Estado para a localização selecionada
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [problems, setProblems] = useState(null);
  
  const getProblemsFromAPI = async () => {
    try {
      const response = await fetch(`${API_URL}/problema`); 
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar problemas:', error);
      throw error;
    }
  };
  
  
  // useEffect para obter a localização atual quando o componente é montado
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permissão de localização não concedida');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        ...region,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,});
    })();

  }, []);

  useEffect(() => {
    getProblemsFromAPI()
      .then((problems) => {
        setProblems(problems);
      })
      .catch((error) => {
        console.error('Erro ao buscar problemas:', error);
      });
  }, []);

 

  // Função para obter a localização atual do usuário
  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permissão de localização não concedida');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setRegion({
      ...region,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    setZoomLevel(1);

    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    setSelectedLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  };

  // Função para navegar para a tela de relatório de problema
  const handleReportProblem = () => {
    navigation.navigate('ReportProblem', { selectedLocation });
  };

  const [selectedProblem, setSelectedProblem] = useState(null);

  const handleViewDetails = () => {
    navigation.navigate('ProblemDetails', { problem: selectedProblem });
  };

  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('loggedInUserId');
      if (id !== null) {
        // O ID do usuário foi encontrado no AsyncStorage
        return id;
      } else {
        // Nenhum ID encontrado
        return null;
      }
    } catch (error) {
      console.error('Erro ao obter o ID do usuário:', error);
      return null;
    }
  };
  

  const handleSupport = async () => {
    try {
      // Adicione o código para obter o id_pessoa aqui
      const id_pessoa = await getUserId(); // Substitua pelo código real para obter o id da pessoa

      const response = await fetch(`${API_URL}/problema/contador/${selectedProblem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Adicione os headers necessários (como tokens de autenticação) aqui, se aplicável
        },
        body: JSON.stringify({ id_pessoa }),
      });
  
      if (response.ok) {
        setSelectedProblem(prevProblem => ({ ...prevProblem, contador_apoio: prevProblem.contador_apoio + 1 }));
        Alert.alert('Sucesso', 'Você apoiou o problema com sucesso');
      } else {
        console.error('Erro ao apoiar o problema');
        Alert.alert('Erro', 'Você já apoiou esse problema');
      }
    } catch (error) {
      console.error('Erro ao apoiar o problema:', error);
    }
  };
  
  



  // Renderização do componente
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          ...region,
          latitudeDelta: zoomLevel * 0.01, // Atualiza o delta da latitude com base no zoomLevel
          longitudeDelta: zoomLevel * 0.01, // Atualiza o delta da longitude com base no zoomLevel
        }}
        onRegionChange={() => setUserInteraction(true)}
        onRegionChangeComplete={() => {
          if (!userInteraction) {
            setZoomLevel(1); // Restaura o zoom quando o usuário não estiver interagindo
          }
        }}
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Localização Atual"
            description="Você está aqui"
          />
        )}
         {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Localização Selecionada"
            description="Endereço Pesquisado"
          />
        )}

          {problems && problems.map((problem) => (
            <Marker
              key={problem.id}
              coordinate={{ latitude: problem.latitude, longitude: problem.longitude }}
              title={problem.titulo}
              description={problem.descricao}
              onPress={() => setSelectedProblem(problem)}
            />
          ))}

          

      </MapView>
      <View style={styles.autocomplete.container}>
        <GooglePlacesAutocomplete
          placeholder="Digite o endereço"
          minLength={2}
          autoFocus={false}
          returnKeyType={'search'}
          listViewDisplayed="auto"
          fetchDetails={true}
          onPress={(data, details = null) => {
            if (details) {
              setSelectedLocation({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              });
            } else {
              setSelectedLocation(currentLocation);
            }
            setRegion({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: zoomLevel * 0.01, // Atualiza o delta da latitude com base no zoomLevel
              longitudeDelta: zoomLevel * 0.01, // Atualiza o delta da longitude com base no zoomLevel
            });
            setZoomLevel(0.1); // Define um zoom maior ao selecionar um endereço
            setSelectedLocation({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });

          }}
          query={{
            key: 'AIzaSyCVa4H3UiBHTefbW5FVFkVEUi6tMydyets',
            language: 'pt-BR',
            components: 'country:br',
          }}
          currentLocation={false}
          styles={{
            textInputContainer: {
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderTopWidth: 0,
              borderBottomWidth: 0,
              borderRadius: 8,
              height: 48,
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              height: 38,
              color: '#5d5d5d',
              fontSize: 16,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
          }}
        />
      </View>
      <TouchableOpacity style={styles.reportButton} onPress={handleReportProblem}>
        <Text style={styles.reportButtonText}>Reportar problema</Text>
      </TouchableOpacity>
      

      <TouchableOpacity style={styles.locationIcon} onPress={handleGetLocation}>
      <Ionicons name="locate" size={60} color="white" />
    </TouchableOpacity>

    {selectedProblem && (
    <TouchableOpacity onPress={handleViewDetails}  style={styles.viewDetailsButton}>
    <Text style={styles.viewDetailsButtonText} >Ver Detalhes do Problema</Text>
    </TouchableOpacity>
    
    )}

        {selectedProblem && (
        <TouchableOpacity onPress={handleSupport} style={styles.supportButton}>
          <Text style={styles.supportButtonText}>Apoiar</Text>
        </TouchableOpacity>
    )}



    </View>
  );
}

// Definindo os estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  autocomplete: {
    container: {
      position: 'absolute',
      top: 20,
      width: '100%',
      paddingHorizontal: 16,
      zIndex: 2,
    },
  },
  reportButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8A2BE2',
  },
  reportButtonText: {
    color: 'white',
    fontSize: 18,
  },
  getLocationButton: {
    position: 'absolute',
    bottom: 80, 
    left: 20,
    right: 20,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50', 
  },
  getLocationButtonText: {
    color: 'white',
    fontSize: 18,
  },

  locationIcon: {
    position: 'relative',
    top: 750,
    left: 400,
    width: 70,
    height: 70,
    borderRadius: 70,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:2,
  },

  viewDetailsButton: {
    position: 'absolute',
    bottom: 70, 
    left: 20,
    right: 20,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFA500',
  },
  viewDetailsButtonText: {
    color: 'white',
    fontSize: 18,
  },

  supportButton: {
    position: 'absolute',
    bottom: 150, 
    left: 20,
    right: 20,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFA500', // Cor de fundo laranja
  },
  
  supportButtonText: {
    color: 'white', // Cor do texto branca
    fontSize: 18,
    fontWeight: 'bold', // Peso da fonte em negrito
  }
  
});

// Exportando o componente MapScreen
export default MapScreen;
