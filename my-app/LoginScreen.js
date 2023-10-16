import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

const LoginScreen = () => {
  const navigation = useNavigation(); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    fetch(`${API_URL}/pessoa/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: username,
        senha: password,
        telefone: null,
      }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Erro ao efetuar o login');
      }
    })
    .then(data => {
      alert(data.message); // Exibe a mensagem de sucesso
      // Aqui você pode decidir o que fazer após o login bem-sucedido
      navigation.navigate('Map');
    })
    .catch(error => {
      console.error('Erro:', error);
      alert('Combinação de usuário e senha inválida');
    });
  };

  const handleRegister = () => {
    navigation.navigate('Register'); 
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
    fontSize: 18,
    marginRight: 5,
  },
  registerLink: {
    fontSize: 18,
    color: '#8A2BE2',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
