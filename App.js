import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screens/HomeScreen';
import RouteSearchScreen from './screens/RouteSearchScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="TU Around"
          component={HomeScreen}
          options={{
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitle,
          }} />
        <Stack.Screen
          name="RouteSearchScreen"
          component={RouteSearchScreen}
          options={({ navigation }) => ({
            headerTitle: 'คุณจะไปที่ไหน',
            headerTitleAlign: 'center',
            headerTitleStyle: styles.headerTitle,
            headerLeft: () => (
              <Ionicons 
                name="arrow-back-outline" 
                size={25} 
                color="black" 
                style={styles.iconStyle}
                onPress={() => navigation.goBack()} 
              />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: 'bold',
    color: 'black',
  },
  iconStyle: {
    marginLeft: 10,
  },
});

export default App