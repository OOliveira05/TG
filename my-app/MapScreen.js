import React, { useState, useEffect  } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native'; // Hook de navegação
import * as Location from 'expo-location'; // Importando a biblioteca de localização do Expo


const MapScreen = () => {
  const [userInteraction, setUserInteraction] = useState(false);
  const [region, setRegion] = useState({
    latitude: -23.08575,
    longitude: -47.20245,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [zoomLevel, setZoomLevel] = useState(12); // Novo estado para controlar o zoom
  const navigation = useNavigation(); // Hook de navegação para permitir a navegação para outras telas

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
    })();
  }, []);

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
    setZoomLevel(0);
  };

  const handleReportProblem = () => {
    navigation.navigate('ReportProblem');
  };

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
        onRegionChangeComplete={(r) => {
          if (!userInteraction) {
            setZoomLevel(12); // Restaura o zoom quando o usuário não estiver interagindo
          }
        }}
      />
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
    bottom: 80, // Ajuste conforme necessário
    left: 20,
    right: 20,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50', // Cor do botão
  },
  getLocationButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default MapScreen;
