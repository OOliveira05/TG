import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

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
            postalCode: result.address_components[6].long_name
          });
        })
        .catch(error => console.error('Erro ao obter dados de geocodificação:', error));
    }
  }, [location]);
  return (
    <View style={styles.container}>
      <View style={styles.autocomplete.container}>
        <GooglePlacesAutocomplete
          placeholder="Digite o endereço"
          minLength={2}
          autoFocus={false}
          returnKeyType={'search'}
          listViewDisplayed="auto"
          fetchDetails={true}
          onPress={(data, details = null) => {
            setLocation({
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
      <View style={styles.locationInfo}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Rua:</Text>
          <TextInput
            style={styles.input}
            value={address.street}
            onChangeText={text => setAddress({ ...address, street: text })}
            placeholder="Digite a rua"
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
            onChangeText={text => setAddress({ ...address, neighborhood: text })}
            placeholder="Digite o bairro"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cidade:</Text>
          <TextInput
            style={styles.input}
            value={address.city}
            onChangeText={text => setAddress({ ...address, city: text })}
            placeholder="Digite a cidade"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Estado:</Text>
          <TextInput
            style={styles.input}
            value={address.state}
            onChangeText={text => setAddress({ ...address, state: text })}
            placeholder="Digite o estado"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>CEP:</Text>
          <TextInput
            style={styles.input}
            value={address.postalCode}
            onChangeText={text => setAddress({ ...address, postalCode: text })}
            placeholder="Digite o CEP"
          />
        </View>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  locationInfo: {
    marginTop: 20,
    marginLeft: 16,
  },
  inputContainer: {
    marginBottom: 20,
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
  
 
});


export default ReportProblemScreen ;
