import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, TouchableHighlight } from 'react-native'; // Importação dos componentes necessários do React Native
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; // Importação do componente de mapa
import { useNavigation } from '@react-navigation/native'; // Hook de navegação
import { Menu, Divider } from 'react-native-paper'; // Componentes do pacote 'react-native-paper'

export default function MapScreen() {
  const navigation = useNavigation(); // Hook de navegação para permitir a navegação para outras telas
  const [visible, setVisible] = useState(false); // Estado para controlar a visibilidade do menu

  const handleReportProblem = () => {
    navigation.navigate('ReportProblem'); // Função para navegar para a tela 'ReportProblem'
  };

  const openMenu = () => setVisible(true); // Função para abrir o menu
  const closeMenu = () => setVisible(false); // Função para fechar o menu

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -23.08575,
          longitude: -47.20243,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Pesquisar endereço"
      />

      <TouchableHighlight onPress={openMenu} style={styles.menuButton}>
        <Text style={styles.menuButtonText}>Menu</Text>
      </TouchableHighlight>

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
  input: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    height: 40,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 10,
  },
  menuButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    backgroundColor: '#8A2BE2', // Cor de fundo roxa
    padding: 10, // Espaçamento interno
    borderRadius: 15, // Borda arredondada
    borderWidth: 1, // Adicionando uma borda
    borderColor: '#8A2BE2', // Cor da borda
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


