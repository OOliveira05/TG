import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';

const ReportProblemScreen = () => {
  // Definindo estados para controlar os inputs
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [photos, setPhotos] = useState([]);

  // Função para lidar com a ação de relatar um problema
  const handleReportProblem = () => {
    // Implemente a lógica para relatar o problema aqui
  };

  // Função para lidar com a seleção de uma categoria
  const handleSelectCategory = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  // Função para lidar com a seleção de uma foto
  const handleSelectPhoto = () => {
    // Implemente a lógica para selecionar uma foto aqui
  };

  // Lista de categorias disponíveis
  const categories = ['Categoria 1', 'Categoria 2', 'Categoria 3'];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Localização"
        value={location}
        onChangeText={setLocation}
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
    </ScrollView>
  );
}

// Estilos para os componentes
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
