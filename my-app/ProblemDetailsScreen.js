import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const ProblemDetailsScreen = ({ route }) => {
  const { problem } = route.params;

  const [pessoa, setPessoa] = useState(null);
  const [orgaoResponsavel, setOrgaoResponsavel] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);

  const fetchAdditionalInfo = async () => {
    try {
      const pessoaResponse = await fetch(`${API_URL}/pessoa/${problem.id_pessoa}`);
      const pessoaData = await pessoaResponse.json();
      setPessoa(pessoaData);

      const orgaoResponse = await fetch(`${API_URL}/orgaoResponsavel/${problem.id_orgao_responsavel}`);
      const orgaoData = await orgaoResponse.json();
      setOrgaoResponsavel(orgaoData);

      const localizacaoResponse = await fetch(`${API_URL}/localizacao/${problem.id_localizacao}`);
      const localizacaoData = await localizacaoResponse.json();
      setLocalizacao(localizacaoData);
    } catch (error) {
      console.error('Erro ao buscar informações adicionais:', error);
    }
  };

  useEffect(() => {
    fetchAdditionalInfo();
  }, []); 

  return (
    <View>
      <Text>Id problema: {problem.id}</Text>
      <Text>Título: {problem.titulo}</Text>
      <Text>Descrição: {problem.descricao}</Text>
      <Text>Contador de Apoio: {problem.contador_apoio}</Text>
      <Text>Data de Criação: {problem.data_criacao}</Text>

      {pessoa && <Text>Nome da Pessoa: {pessoa.nome}</Text>}
      {orgaoResponsavel && <Text>Nome do Órgão: {orgaoResponsavel.nome}</Text>}
      {localizacao && (
        <Text>
          Latitude: {localizacao.latitude}, Longitude: {localizacao.longitude}
        </Text>
      )}

      { /* Adicionando os IDs do problema */ }
      <Text>ID da Pessoa: {problem.id_pessoa}</Text>
      <Text>ID do Órgão: {problem.id_orgao_responsavel}</Text>
      <Text>ID da Localização: {problem.id_localizacao}</Text>
    </View>
  );
};

export default ProblemDetailsScreen;
