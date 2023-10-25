// Importando o React para utilizar no código
import React from 'react';

// Importando os componentes necessários do React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importando o componente PaperProvider do react-native-paper para estilização
import { Provider as PaperProvider } from 'react-native-paper';

//Importando serviço de geocodificação
import Geocoder from 'react-native-geocoding';
Geocoder.init('AIzaSyCVa4H3UiBHTefbW5FVFkVEUi6tMydyets');



// Importando os componentes de outras telas
import LoginScreen from './LoginScreen';
import MapScreen from './MapScreen';
import ReportProblemScreen from './ReportProblemScreen';
import RegisterScreen from './RegisterScreen';
import ProblemDetailsScreen from './ProblemDetailsScreen';
import ProblemList from './ProblemList';
import ProblemDetailsList from './ProblemDetailsList';

global.API_URL = 'https://2b77-186-201-74-210.ngrok.io';

// Criando uma pilha de navegação usando createStackNavigator
const Stack = createStackNavigator();

// Componente principal do aplicativo
const App = () => {
  return (
    // Envolve a aplicação com o PaperProvider para fornecer estilos consistentes
    <PaperProvider>
      {/* Define a navegação da aplicação */}
      <NavigationContainer>
        {/* Cria a pilha de navegação */}
        <Stack.Navigator initialRouteName="Login">
          {/* Define as telas e seus componentes */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="ReportProblem" component={ReportProblemScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ProblemDetails" component={ProblemDetailsScreen} />
          <Stack.Screen name="ProblemList" component={ProblemList} />
          <Stack.Screen name="ProblemDetailsList" component={ProblemDetailsList} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

// Exporta o componente App para ser utilizado na aplicação
export default App;
