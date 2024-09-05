// HowToUseScreen.js
import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { AntDesign, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import RouteSearchScreen from "./screens/RouteSearchScreen";
import TransportScreen from "./screens/TransportScreen";
import RouteScreen from "./screens/RouteScreen";
import HowToUseScreen from "./screens/HowToUseScreen";
import DashboardScreen from "./screens/DashboardScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Stack Navigator สำหรับ Home
const HomeStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={({ navigation }) => ({
        headerTitle: "TU AROUND",
        headerTitleAlign: "center",
        headerTitleStyle: styles.headerTitle,
        headerTransparent: true,
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
        headerTitle: "คุณจะไปที่ไหน",
        headerTitleAlign: "center",
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
    <Stack.Screen
      name="RouteScreen"
      component={RouteScreen}
      options={({ navigation }) => ({
        headerTitle: "ROUTE",
        headerTitleAlign: "center",
        headerTitleStyle: styles.headerTitle,
        headerTransparent: true,
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
    <Stack.Screen
      name="HowToUseScreen"
      component={HowToUseScreen}
      options={({ navigation }) => ({
        headerTitle: "",
        headerTitleAlign: "center",
        headerTitleStyle: styles.headerTitle,
        headerTransparent: true,
        headerRight: () => (
          <AntDesign
            name="close"
            size={27}
            color="#2a2a2a"
            style={styles.iconCloseStyle}
            onPress={() => navigation.goBack()}
          />
        ),
        headerLeft: () => null, // เอาไอคอนย้อนกลับออก
      })}
    />
    <Stack.Screen
      name="DashboardScreen"
      component={DashboardScreen}
      options={({ navigation }) => ({
        headerTitle: "DASHBOARD",
        headerTitleAlign: "center",
        headerTitleStyle: styles.headerTitle,
        headerTransparent: true,
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

// Stack Navigator สำหรับ Transport
const TransportStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Transport"
      component={TransportScreen}
      options={({ navigation }) => ({
        headerTitle: "TRANSPORT",
        headerTitleAlign: "center",
        headerTitleStyle: styles.headerTitle,
        headerTransparent: true,
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

// Custom Drawer Content
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Other Transportation"
        onPress={() => props.navigation.navigate("TransportScreen")}
        icon={({ color, size }) => (
          <Ionicons name="car-sport-sharp" size={size} color="#000000" />
        )}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
      />
        <DrawerItem
          label="Dashboard"
          onPress={() => props.navigation.navigate("DashboardScreen")}
          icon={({ color, size }) => (
            <MaterialIcons name="space-dashboard" size={size} color="#000000" />
          )}
          labelStyle={styles.drawerLabel}
          style={styles.drawerItem}
        />
      <DrawerItem
        label="How to use"
        onPress={() => props.navigation.navigate("HowToUseScreen")}
        icon={({ color, size }) => (
          <Octicons name="question" size={size} color="#000000" />
        )}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
      />
    </DrawerContentScrollView>
  );
};

// Main App Component
const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false, // ซ่อน header ของ Drawer
        }}
      >
        <Drawer.Screen name="HomeScreen" component={HomeStackNavigator} />
        <Drawer.Screen name="TransportScreen" component={TransportStackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: "bold",
    color: "#f23a04",
  },
  iconStyle: {
    marginLeft: 17,
    marginTop: 5,
  },
  iconCloseStyle: {
    marginRight: 30, // ระยะห่างจากขอบขวา
    marginTop: 15, // ระยะห่างจากด้านบน
  },
  drawerItem: {
    marginVertical: 3, // ปรับให้ไอคอนชิดกับชื่อ
  },
  drawerLabel: {
    marginLeft: -15, // ปรับให้ชื่อชิดกับไอคอนมากขึ้น
    color: "#000000", // สีของชื่อใน Drawer
    fontSize: 15,
  },
});

export default App;
