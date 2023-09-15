import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  TouchableHighlight 
} from 'react-native'; // Importação dos componentes necessários do React Native
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // Importação do componente de mapa
import { useNavigation } from '@react-navigation/native'; // Hook de navegação
import { Menu, Divider } from 'react-native-paper'; // Componentes do pacote 'react-native-paper'
import axios from 'axios';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function MapScreen() {
  const navigation = useNavigation(); // Hook de navegação para permitir a navegação para outras telas
  const [visible, setVisible] = useState(false); // Estado para controlar a visibilidade do menu
  const [searchText, setSearchText] = useState(''); // Adição do estado searchText
  const [userInteraction, setUserInteraction] = useState(false);//Interação do usuário
  const [region, setRegion] = useState({
    latitude: -23.08575,
    longitude: -47.20243,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Função para navegar para a tela 'ReportProblem'
  const handleReportProblem = () => {
    navigation.navigate('ReportProblem'); 
  };

  // Função para abrir o menu
  const openMenu = () => {
    setVisible(true); 
    setUserInteraction(false);
  };

  // Função para fechar o menu
  const closeMenu = () => {
    setVisible(false);
    setUserInteraction(false);
  };

  // Função para lidar com a seleção de um lugar no Google Places Autocomplete
  const handlePlaceSelect = (data, details) => {
    console.log(details);
    if (details && details.geometry && details.geometry.location) {
      const { lat, lng } = details.geometry.location;
      setRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  // Função para buscar um endereço
  const handleSearchAddress = async () => {
    try {
      setUserInteraction(false); 
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchText}&key=AIzaSyCVa4H3UiBHTefbW5FVFkVEUi6tMydyets`);
      
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Componente do mapa */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChange={(newRegion) => {
          if (userInteraction) {
            setRegion(newRegion);
          }
        }}
        onRegionChangeComplete={() => setUserInteraction(false)}
        onTouchStart={() => setUserInteraction(false)}
      />

      {/* Componente de busca de endereço */}
      <GooglePlacesAutocomplete
        placeholder='Pesquisar endereço'
        onPress={handlePlaceSelect}
        query={{
          key: 'AIzaSyCVa4H3UiBHTefbW5FVFkVEUi6tMydyets',
          language: 'pt-BR',
        }}
        styles={styles.autocomplete}
      />

      {/* Botão para abrir o menu */}
      <TouchableHighlight onPress={openMenu} style={styles.menuButton}>
        <Text style={styles.menuButtonText}>Menu</Text>
      </TouchableHighlight>

      {/* Menu */}
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={{ x: 10, y: 210 }}
      >
        <Menu.Item onPress={() => {}} title="Consultar problemas" />
        <Divider />
        <Menu.Item onPress={() => {}} title="Ver perfil" />
        <Divider />
        <Menu.Item onPress={() => {}} title="Opção 3" />
      </Menu>

      {/* Botão para reportar um problema */}
      <TouchableOpacity onPress={handleReportProblem} style={styles.reportButton}>
        <Text style={styles.reportButtonText}>Reportar um problema</Text>
      </TouchableOpacity>
    </View>
  );
}

// Estilos CSS para os elementos na tela
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
      zIndex:2,
    },
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
  },
  menuButton: {
    position: 'absolute',
    top: 80,
    left: 20,
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#8A2BE2',
  },
  menuButtonText: {
    color: 'white',
    fontSize: 18,
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
});
