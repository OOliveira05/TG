import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';

const ReportProblemScreen = ({ route }) => {
  const { selectedLocation } = route.params;
  const [location, setLocation] = useState(selectedLocation);
  const [address, setAddress] = useState({
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [cep, setCep] = useState(address.postalCode);
  const [problemDescription, setProblemDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (location) {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=AIzaSyCVa4H3UiBHTefbW5FVFkVEUi6tMydyets`)
        .then(response => response.json())
        .then(data => {
          const result = data.results[0];
          setAddress({
            street: result.address_components[1].long_name,
            number: result.address_components[0].long_name,
            neighborhood: result.address_components[2].long_name,
            city: result.address_components[3].long_name,
            state: result.address_components[4].short_name,
            postalCode: result.address_components[6].long_name,
          });
          setCep(result.address_components[6].long_name); // Atualiza o estado do CEP
        })
        .catch(error => console.error('Erro ao obter dados de geocodificação:', error));
    }
  }, [location]);

  const searchByCep = () => {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => response.json())
      .then(data => {
        setAddress({
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
          postalCode: data.cep,
        });
      })
      .catch(error => console.error('Erro ao obter dados de endereço:', error));
  }

  const openCategoryModal = () => {
    setModalVisible(true);
  }

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setModalVisible(false);
  }

  return (
    <View style={styles.locationInfo}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>CEP:</Text>
        <TextInput
          style={styles.input}
          value={cep}
          onChangeText={text => setCep(text)} // Atualiza o estado do CEP
          placeholder="Digite o CEP"
        />
        <TouchableOpacity onPress={searchByCep} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Rua:</Text>
        <TextInput
          style={styles.input}
          value={address.street}
          editable={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Número:</Text>
        <TextInput
          style={styles.input}
          value={address.number}
          onChangeText={text => setAddress({ ...address, number: text })}
          placeholder="Digite o número"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Bairro:</Text>
        <TextInput
          style={styles.input}
          value={address.neighborhood}
          editable={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cidade:</Text>
        <TextInput
          style={styles.input}
          value={address.city}
          editable={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Estado:</Text>
        <TextInput
          style={styles.input}
          value={address.state}
          editable={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descrição do Problema:</Text>
        <TextInput
          style={styles.inputDescricao}
          value={problemDescription}
          onChangeText={text => setProblemDescription(text)}
          placeholder="Descreva o problema"
          multiline={true}
          numberOfLines={4}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Categoria do Problema:</Text>
        <TouchableOpacity onPress={openCategoryModal} style={styles.categoryButton}>
          <Text>{selectedCategory || 'Selecione a categoria'}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable onPress={() => selectCategory('Problema na estrada')} style={styles.modalOption}>
              <Text>Problema na estrada</Text>
            </Pressable>
            <Pressable onPress={() => selectCategory('Iluminação Pública')} style={styles.modalOption}>
              <Text>Iluminação Pública</Text>
            </Pressable>
            <Pressable onPress={() => selectCategory('Cuidados com Vegetação')} style={styles.modalOption}>
              <Text>Cuidados com Vegetação</Text>
            </Pressable>
            <Pressable onPress={() => selectCategory('Cano estourado')} style={styles.modalOption}>
              <Text>Cano estourado</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)} style={styles.modalOptionCancel}>
              <Text style = {{color: 'red'}}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>


    </View>
  );
}

  const styles = StyleSheet.create({
    locationInfo: {
      marginTop: 20,
      marginLeft: 16,
    },
    inputContainer: {
      marginBottom: 10,
    },
    label: {
      marginBottom: 5,
      fontWeight: 'bold',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingLeft: 8,
      borderRadius: 10,
      width: '100%',
    },
    inputDescricao: {
      height: 60,
      borderColor: 'gray',
      borderWidth: 1,
      paddingLeft: 8,
      borderRadius: 10,
      width: '100%',
    },
    searchButton: {
      padding: 10,
      marginTop: 10,
      alignItems: 'center',
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#8A2BE2',
    },
    searchButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    categoryButton: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingLeft: 8,
      borderRadius: 10,
      width: '100%',
      justifyContent: 'center',
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
      padding: 50,
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
      marginBottom: 30, // Espaçamento entre as opções
      width: '100%',
      alignItems: 'center',
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: 'black', // Cor da divisória
      marginVertical: 5, // Espaçamento vertical da divisória
    },
    modalOptionCancel: {
      marginTop: 10, // Espaçamento entre a última opção e a divisória
      width: '100%',
      alignItems: 'center',
      
    },
});

export default ReportProblemScreen;
