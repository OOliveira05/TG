import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importação do hook de navegação

const LoginScreen = () => {
  const navigation = useNavigation(); // Inicializa o hook de navegação

  // Definindo estados para os campos de usuário e senha
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implemente a lógica de autenticação aqui
    if (username === 'admin' && password === '1234') {
      navigation.navigate('Map');
    } else {
      alert('Combinação de usuário e senha inválida');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register'); // Navega para a tela de registro
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem Vindo</Text>
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Entrar</Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Precisa se registrar?</Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerLink}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
    borderRadius: 10,
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: 'white',
    fontSize: 18,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  registerText: {
    marginRight: 5,
  },
  registerLink: {
    color: '#8A2BE2',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
