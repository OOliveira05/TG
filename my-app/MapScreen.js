// Importando os módulos necessários do React Native e outras bibliotecas
import React, { useState, useEffect  } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native'; // Hook de navegação
import * as Location from 'expo-location'; // Importando a biblioteca de localização do Expo

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

  // useEffect para controlar o tempo de interação do usuário com o mapa
  useEffect(() => {
    const mapInteractionTimeout = setTimeout(() => {
      setUserInteraction(false);
    }, 2000);
  
    return () => clearTimeout(mapInteractionTimeout);
  }, [userInteraction]);

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
    navigation.navigate('ReportProblem');
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
      <TouchableOpacity style={styles.getLocationButton} onPress={handleGetLocation}>
        <Text style={styles.getLocationButtonText}>Obter Localização Atual</Text>
      </TouchableOpacity>
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
});

// Exportando o componente MapScreen
export default MapScreen;
