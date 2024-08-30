import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import RouteSearchScreen from './screens/RouteSearchScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="TU Around" component={HomeScreen} />
        <Stack.Screen name="RouteSearchScreen" component={RouteSearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;