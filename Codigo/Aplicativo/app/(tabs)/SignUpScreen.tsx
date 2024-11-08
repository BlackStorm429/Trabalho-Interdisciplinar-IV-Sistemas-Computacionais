import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import axios from 'axios';
import { TextInputCustom } from '@/components/TextInputCustom';
import { PasswordInputCustom } from '@/components/PasswordInputCustom';
import { ENV } from '@/config/environment';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUpScreen'>;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [doorPassword, setDoorPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const clearFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDoorPassword('');
    setErrorMessage('');
  };

  const handleSignUp = async () => {
    // Validando se todos os campos estão preenchidos
    const anyFieldEmpty = !name || !email || !password || !confirmPassword || !doorPassword;

    if (anyFieldEmpty) {
      setErrorMessage("Todos os campos são obrigatórios!");
      console.log(`Dados: ${name}, ${email}, ${password}, ${confirmPassword}, ${doorPassword}`);
      return;
    }

    // Verificação de senhas iguais
    if (password !== confirmPassword) {
      setErrorMessage("As senhas de login não coincidem!");
      return;
    }

    // Validação de e-mail
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setErrorMessage("Por favor, insira um e-mail válido.");
      return;
    }

    // Cadastro do usuário no backend
    try {
      console.log(`Dados: ${name}, ${email}, ${password}, ${confirmPassword}, ${doorPassword}`);
      console.log(ENV.API_URL);
      
      const response = await axios.post(ENV.API_URL + '/cadastrar', {
        name,
        email,
        password,
        doorPassword,
      });
      console.log('Usuário cadastrado com sucesso:', response.data);
      // Redefinindo os campos após o cadastro
      clearFields();
      navigation.navigate('SignInScreen');
    } catch (error) {
      console.error('Erro ao cadastrar o usuário:', error);
      setErrorMessage('Erro ao cadastrar o usuário, tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/handle-icon.png')} style={styles.logo} />
      <Text style={styles.appName}>SmartLock</Text>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <View style={styles.inputContainer}>
        <TextInputCustom 
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <TextInputCustom 
          placeholder="E-mail"
          inputMode="email"
          onChangeText={setEmail}
        /> 
        <PasswordInputCustom 
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
          />
        <PasswordInputCustom 
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword} 
        />
        <PasswordInputCustom 
          placeholder="Senha da Porta"
          value={doorPassword}
          onChangeText={setDoorPassword}
        />
      </View>
      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
        <Text style={styles.signinText}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE4E9',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF7690',
    marginBottom: 30,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  input: {
    width: '80%',
    padding: 10,
    backgroundColor: '#FFD6E2',
    borderRadius: 10,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    color: '#FF7690',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '80%',
    marginBottom: 15,
  },
  signUpButton: {
    width: '80%',
    padding: 15,
    backgroundColor: '#FF7690',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  signUpText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signinText: {
    color: '#FF7690',
    marginTop: 10,
  },
});
