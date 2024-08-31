import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import RouteSearchScreen from './screens/RouteSearchScreen';
import TransportScreen from './screens/TransportScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={({ navigation }) => ({
        headerTitle: 'TU AROUND',
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitle,
        headerLeft: () => (
          <Ionicons
            name="menu"
            size={25}
            color="#2a2a2a"
            style={styles.iconStyle}
            onPress={() => navigation.openDrawer()}
          />
        ),
      })}
    />
    <Stack.Screen
      name="RouteSearchScreen"
      component={RouteSearchScreen}
      options={({ navigation }) => ({
        headerTitle: 'คุณจะไปที่ไหน',
        headerTitleAlign: 'center',
        headerTitleStyle: styles.headerTitle,
        headerLeft: () => (
          <AntDesign
            name="left"
            size={25}
            color="#2a2a2a"
            style={styles.iconStyle}
            onPress={() => navigation.goBack()}
          />
        ),
      })}
    />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,  // ซ่อน header ของ Drawer
        }}
      >
        <Drawer.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{ drawerLabel: 'Home' }}
        />
        <Drawer.Screen
          name="Transport"
          component={TransportScreen}
          options={{ drawerLabel: 'Transport' }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: 'bold',
    color: '#f23a04',
  },
  iconStyle: {
    marginLeft: 10,
  },
});

export default App;
