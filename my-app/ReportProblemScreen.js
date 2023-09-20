import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';



const ReportProblemScreen = () => {
  
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
            setLocation(data.description);
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
 
});


export default ReportProblemScreen ;
