import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';


const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telefone, setTelefone] = useState('');
 
  


//----------------------------------------------------------------------------------------------------------------------------------------

  const validarCPF = () => {
    const cpfLimpo = cpf.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
      alert('CPF inválido.');
      return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }

    let digito1 = soma % 11;
    digito1 = digito1 < 2 ? 0 : 11 - digito1;

    if (parseInt(cpfLimpo.charAt(9)) !== digito1) {
      alert('CPF inválido.');
      return false;
    }

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }

    let digito2 = soma % 11;
    digito2 = digito2 < 2 ? 0 : 11 - digito2;

    if (parseInt(cpfLimpo.charAt(10)) !== digito2) {
      alert('CPF inválido.');
      return false;
    }

    return true;
  };

  //--------------------------------------------------------------------------------------------------------------------------------------------------------------

  const handleRegister = async () => {
    if (!email || !name || !cpf || !password || !confirmPassword || !telefone) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    if (!validarCPF()) {
      return;
    }

    const userData = {
      nome: name,
      cpf: parseInt(cpf),
      email,
      telefone: parseInt(telefone),
      senha: password
    };

    try {
      const response = await axios.post(`${API_URL}/pessoa`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        alert('Registro bem-sucedido!');
        navigation.navigate('Login');
      } else {
        alert('Erro ao registrar. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  };


  const handleLoginNavigation = () => {
    navigation.navigate('Login'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={(text) => setCpf(text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={(text) => setTelefone(text)}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
      />

      


      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>Registrar</Text>
      </TouchableOpacity>

    
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Já possui uma conta?</Text>
        <TouchableOpacity onPress={handleLoginNavigation}>
          <Text style={styles.loginLink}>Entrar</Text>
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
  registerButton: {
    backgroundColor: '#8A2BE2',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  registerText: {
    color: 'white',
    fontSize: 18,
  },

  loginContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  loginText: {
    marginTop: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  loginLink: {
    marginTop: 10,
    fontSize: 18,
    color: '#8A2BE2',
    textDecorationLine: 'underline',
    
  },
});

export default RegisterScreen;
