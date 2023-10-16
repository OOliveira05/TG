import React from 'react';
import { View, Text } from 'react-native';

const ProblemDetailsScreen = ({ route }) => {
  const { problem } = route.params;

  return (
    <View>
      <Text>Título: {problem.titulo}</Text>
      <Text>Descrição: {problem.descricao}</Text>
      {/* Adicione outros detalhes conforme necessário */}
    </View>
  );
};

export default ProblemDetailsScreen;
