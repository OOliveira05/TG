import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const ReportProblemScreen = ({ route }) => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [photos, setPhotos] = useState(['https://via.placeholder.com/100']);

  const handleReportProblem = () => {
    // Implemente a lógica para relatar o problema aqui
  };

  const handleSelectCategory = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  const handleSelectPhoto = () => {
    // Implemente a lógica para selecionar uma foto aqui
  };

  const categories = ['Categoria 1', 'Categoria 2', 'Categoria 3'];

  const selectedAddress = route.params?.selectedAddress;
  const initialLocationValue = selectedAddress ? selectedAddress : '';

  return (
    <View style={styles.container}>
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
          key: 'AIzaSyCVa4H3UiBHTefbW5FVFkVEUi6tMydyets', // Substitua pela sua API Key do Google Maps
          language: 'pt-BR',
          components: 'country:br',
        }}
    
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
      <TextInput
        style={styles.input}
        placeholder="Localização"
        value={location}
        onChangeText={setLocation}
        defaultValue={initialLocationValue}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      {categories.map((cat, index) => (
        <TouchableOpacity 
          style={category === cat ? styles.selectedCategoryButton : styles.categoryButton}
          onPress={() => handleSelectCategory(cat)}
          key={index}
        >
          <Text style={styles.categoryButtonText}>{cat}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.attachPhotoButton} onPress={handleSelectPhoto}>
        <Text style={styles.attachPhotoText}>Anexar Foto</Text>
      </TouchableOpacity>
      {photos.map((photo, index) => (
        <Image source={{ uri: photo }} style={styles.photo} key={index} />
      ))}
      <TouchableOpacity style={styles.reportButton} onPress={handleReportProblem}>
        <Text style={styles.reportButtonText}>Reportar Problema</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 50,
    marginTop: 100, // Alterei 'top' para 'marginTop'
  },
  categoryButton: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 50,
  },
  selectedCategoryButton: {
    ...this.categoryButton,
    backgroundColor: '#DDDDDD',
  },
  categoryButtonText: {
    fontSize: 16,
  },
  attachPhotoButton: {
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  attachPhotoText: {
    color: 'white',
    fontSize: 16,
  },
  photo: {
    width: 100,
    height: 100,
    marginBottom: 12,
    borderRadius: 50,
  },
  reportButton: {
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ReportProblemScreen;
