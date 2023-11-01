  import React, { useState, useEffect } from 'react';
  import { View, TextInput, Text, StyleSheet, TouchableOpacity, Modal, Pressable, Image, ScrollView } from 'react-native';
  import * as ImagePicker from 'expo-image-picker';
  import { Alert } from 'react-native';
  import { useNavigation } from '@react-navigation/native'; 
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { CommonActions } from '@react-navigation/native';
  import axios from 'axios';




  const ReportProblemScreen = ({ route }) => {
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState('');
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

    const [cep, setCep] = useState('');
    const [problemDescription, setProblemDescription] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [problemTitle, setProblemTitle] = useState('');
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [photoUrl, setPhotoUrl] = useState('');

    

    const categoryToOrgaoId = {
    'Problema na estrada': 2,
    'Iluminação Pública': 4,
    'Cuidados com Vegetação': 1,
    'Cano estourado': 3,
  };

  const uploadImage = async (uri, problemTitle) => {
    const formData = new FormData();
    formData.append('key', '22498dda22523dea4793b5a0c51a849a'); // Substitua YOUR_CLIENT_API_KEY pela sua chave da API imgbb
    formData.append('image', {
      uri: uri,
      type: 'image/jpeg',
      name: problemTitle ? `${problemTitle}.jpg` : 'problem.jpg',
    });

    try {
      const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.data && response.data.data.url) {
        setPhotoUrl(response.data.data.url);
        console.log('Resposta da API ao enviar imagem:', response.data);
        console.log('URL da imagem enviada:', response.data.data.url);
      } else {
        Alert.alert('Erro ao enviar foto', 'Não foi possível enviar a foto.');
      }
    } catch (error) {
      console.error('Erro ao enviar foto:', error);
    }
  };



    useEffect(() => {
      if (location) {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=AIzaSyAscxb7rTL94vweud-fk8bnTJyV82fm2E0`)
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
            setCep(result.address_components[6].long_name);
          })
          .catch(error => console.error('Erro ao obter dados de geocodificação:', error));
      }
    }, [location]);


    const openCategoryModal = () => {
      setModalVisible(true);
    }

    const selectCategory = (category) => {
      setSelectedCategory(category);
      setModalVisible(false);
    }

    const openImagePicker = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
      if (status !== 'granted') {
        alert('Desculpe, precisamos da permissão para acessar sua galeria de fotos.');
        return;
      }
    
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
    
      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
        setSelectedImage(result.assets[0].uri);
      }
    };
    
    const openCamera = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
      if (status !== 'granted') {
        alert('Desculpe, precisamos da permissão para acessar a câmera.');
        return;
      }
    
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
      });
    
      if (!result.canceled) {
        await uploadImage(result.assets[0].uri);
        setSelectedImage(result.assets[0].uri); 
      }
    };
    

    const removeImage = (index) => {
      const newImages = [...selectedImage];
      newImages.splice(index, 1);
      setSelectedImage(newImages);

      
    }

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

    const createProblem = async (locationId) => {
      if (!photoUrl) {
        Alert.alert('Erro ao criar problema', 'Por favor, anexe uma foto antes de enviar o problema.');
        return;
      } 
      const orgaoResponsavelId = categoryToOrgaoId[selectedCategory];
      const problemData = {
        titulo: problemTitle,
        descricao: problemDescription,
        contador_apoio: 0,
        id_pessoa: loggedInUserId, 
        id_orgao_responsavel: orgaoResponsavelId, 
        id_localizacao: locationId,
        url_foto: photoUrl
      };
    
      try {
        const response = await axios.post(`${API_URL}/problema`, problemData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Problema criado com sucesso:', response.data);
        Alert.alert(
          'Problema Cadastrado com Sucesso!',
          'Problema enviado para o órgão responsável\nObrigado por reportar',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Map');
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Map', params: { reload: true } }],
                  })
                );
              },
            },
          ]
        );
      } catch (error) {
        console.error('Erro ao criar problema:', error);
        Alert.alert('Erro ao criar problema', 'Não foi possível enviar o problema. Por favor, tente novamente mais tarde.');
      }
    };
    

    const insertLocation = async () => {
      const numericCep = cep.replace(/\D/g, '');
      const locationData = {
        latitude:  location.latitude,
        longitude: location.longitude,
        cep: numericCep,
        rua: address.street,
        numero: address.number,
        bairro: address.neighborhood,
        cidade: address.city,
        estado: address.state,
      };

    
      try {
        const response = await axios.post(`${API_URL}/localizacao`, locationData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('Localização inserida com sucesso:', response.data);
        createProblem(response.data.insertId);
      } catch (error) {
        console.error('Erro ao inserir dados de localização:', error);
        Alert.alert('Erro ao inserir localização', 'Não foi possível inserir a localização. Por favor, tente novamente mais tarde.');
      }
    };

    

    return (
      <ScrollView>
        <TouchableOpacity onPress={() => navigation.navigate('Map')} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <View style={styles.locationInfo}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>CEP:</Text>
            <TextInput
              style={styles.input}
              value={cep}
              editable={false}
            />
            
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
              editable={false}
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
            <Text style={styles.label}>Título do Problema:</Text>
            <TextInput
              style={styles.input}
              value={problemTitle}
              onChangeText={text => setProblemTitle(text)}
              placeholder="Digite o título do problema"
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Anexar Foto:</Text>
            <TouchableOpacity onPress={openImagePicker} style={styles.categoryButton}>
              <Text>{selectedImage.length > 0 ? 'Ver Fotos' : 'Anexar'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tirar Foto:</Text>
            <TouchableOpacity onPress={openCamera} style={styles.categoryButton}>
            <Text>Tirar Foto</Text>
            </TouchableOpacity>
          </View>

          {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <TouchableOpacity onPress={() => setSelectedImage('')} style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Remover</Text>
          </TouchableOpacity>
        </View>
      ) : null}

          <TouchableOpacity onPress={insertLocation} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Enviar Problema</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
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
        width: '95%',
      },
      inputDescricao: {
        height: 60,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 10,
        width: '95%',
      },
      searchButton: {
        padding: 10,
        marginTop: 10,
        alignItems: 'center',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8A2BE2',
        width: '95%',
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
        width: '95%',
        justifyContent: 'center',
      },
      centeredView: {
        flexGrow: 1,
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

      imageContainer: {
        alignItems: 'center',
        marginTop: 10,
      },
      selectedImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginTop: 5,
      },
      imageWrapper: {
        position: 'relative',
      },
    
      removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 5,
        paddingVertical: 3,
        paddingHorizontal: 8,
      },
    
      removeButtonText: {
        color: 'red',
        fontSize: 12,
      },

      backButton: {
        marginTop: 16,
        backgroundColor: '#8A2BE2',
        padding: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginLeft:15,
      },
      backButtonText: {
        color: '#fff',
      },
  });

  export default ReportProblemScreen;
