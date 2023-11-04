import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
  ScrollView
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalComponent from './ModalComponent'; 
import { CommonActions } from '@react-navigation/native';



const MapScreen = ({ route }) => {
  const [reloadMap, setReloadMap] = useState(false);
  const [userInteraction, setUserInteraction] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: -23.08575,
    longitude: -47.20245,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [zoomLevel, setZoomLevel] = useState(12);
  const navigation = useNavigation();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [problems, setProblems] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showButtons, setShowButtons] = useState(false);

  const orgaoCores = {
    1: '#00FF00',  //Mato alto 
    2: '#8B4513',  // Tapa buraco
    3: '#008B8B',  // SAAE
    4: '#FFFF00',  //Iluminação
  };
  

  const handleMapPress = () => {
    setShowButtons(false);
  };
 

  const openModal = () => {
    setModalVisible(true);
  }

  const closeModal = () => {
    setModalVisible(false);
  }

  const handleGetLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permissão de localização não concedida');
      return;
    }
  
    let location = await Location.getCurrentPositionAsync({});
    
    const newRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    };
  
    setRegion(newRegion);
  
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

  const handleReportProblem = () => {
    navigation.navigate('ReportProblem', { selectedLocation });
  };

  const handleViewDetails = () => {
    navigation.navigate('ProblemDetails', { problem: selectedProblem });
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

  const handleSupport = async () => {
    try {
      const id_pessoaPontua = await getUserId();

      const response = await fetch(`${API_URL}/problema/pontua/${selectedProblem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ id_pessoaPontua }),
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

  const getProblemsFromAPI = async () => {
    try {
      const response = await fetch(`${API_URL}/problema/ativo/verifica `, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar problemas:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login', params: { reloadLogin: true } }],
      }));
    } catch (error) {
      console.error('Erro ao fazer logoff:', error);
    }
  };
  

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
        longitude: location.coords.longitude,
      });
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

  useEffect(() => {
    if (route.params && route.params.reloadMap) {
      setReloadMap(prev => !prev);
    }
  }, [route.params]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        key={reloadMap ? new Date().getTime() : 'map'}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          ...region,
          latitudeDelta: zoomLevel * 0.01,
          longitudeDelta: zoomLevel * 0.01,
        }}
        onRegionChange={() => setUserInteraction(true)}
        onRegionChangeComplete={() => {
          if (!userInteraction) {
            setZoomLevel(1);
          }
        }}
        onPress={() => {
          setSelectedProblem(null); // Ao tocar no mapa, deseleciona o problema
          setShowButtons(false);
        }}

      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Localização Atual"
            description="Você está aqui"
            pinColor='#8A2BE2'
          />
        )}
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Localização Selecionada"
            description="Endereço Pesquisado"
            pinColor='#8A2BE2'
          />
        )}

        {problems && problems.map((problem) => (
          <Marker
            key={problem.id}
            coordinate={{ latitude: problem.latitude, longitude: problem.longitude }}
            title={problem.titulo}
            description={problem.descricao}
            pinColor={orgaoCores[problem['Id Orgao Responsavel']] || 'black'}
            onPress={() => setSelectedProblem(problem)}
          />
        ))}
      </MapView>

      <View style={styles.autocomplete.container}>
        <GooglePlacesAutocomplete
          placeholder="Pesquise o endereço para reportar o problema"
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
              latitudeDelta: zoomLevel * 0.01,
              longitudeDelta: zoomLevel * 0.01,
            });
            setZoomLevel(0.1);
            setSelectedLocation({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
            });
          }}
          query={{
            key: 'AIzaSyAscxb7rTL94vweud-fk8bnTJyV82fm2E0',
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
        <TouchableOpacity onPress={handleViewDetails} style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsButtonText} >Ver Detalhes do Problema</Text>
        </TouchableOpacity>
      )}

      {selectedProblem && (
        <TouchableOpacity onPress={handleSupport} style={styles.supportButton}>
          <Text style={styles.supportButtonText}>Apoiar</Text>
        </TouchableOpacity>
      )}

      {/* Botão de menu */}
      <TouchableOpacity onPress={openModal} style={styles.menuButton}>
        <Ionicons name="menu" size={50} color="white" />
      </TouchableOpacity>

    
      <ModalComponent
        modalVisible={modalVisible}
        closeModal={closeModal}
        navigation={navigation}
        handleLogout={handleLogout}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
      backgroundColor: 'white',
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
  locationIcon: {
    position: 'relative',
    top: 700,
    left: 400,
    width: 70,
    height: 70,
    borderRadius: 70,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
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
    backgroundColor: '#8A2BE2',
  },
  viewDetailsButtonText: {
    color: 'white',
    fontSize: 18,
  },
  supportButton: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8A2BE2',
  },
  supportButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    position: 'absolute',
    top: 80,
    left: 20,
    zIndex: 1,
    backgroundColor: '#8A2BE2',
    borderRadius: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOption: {
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MapScreen;
