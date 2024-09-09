//App.js
import React, { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { AntDesign, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import * as Font from 'expo-font'; // นำเข้า expo-font
import HomeScreen from "./screens/HomeScreen";
import RouteSearchScreen from "./screens/RouteSearchScreen";
import TransportScreen from "./screens/TransportScreen";
import RouteScreen from "./screens/RouteScreen";
import HowToUseScreen from "./screens/HowToUseScreen";
import DashboardScreen from "./screens/DashboardScreen";
import ReportScreen from "./screens/ReportScreen";
import MotorcycleScreen from "./screens/MotorcycleScreen";
import VanScreen from "./screens/VanScreen";
import AnnounceScreen from "./screens/AnnouceScreen"; 

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const fetchFonts = () => {
  return Font.loadAsync({
    'Prompt-Regular': require('./assets/fonts/Prompt-Regular.ttf'),
    'Prompt-Bold': require('./assets/fonts/Prompt-Bold.ttf'),
    'Prompt-Medium': require('./assets/fonts/Prompt-Medium.ttf'), // ปรับเส้นทางฟอนต์ตามตำแหน่งที่เก็บ
  });
};

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
        headerTitle: "ค้นหาเส้นทาง",
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
        headerTitle: "",
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
      name="AnnounceScreen"
      component={AnnounceScreen} // เพิ่ม AnnounceScreen
      options={({ navigation }) => ({
        headerTitle: "ประกาศ",
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

const TransportStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Transport"
      component={TransportScreen}
      options={({ navigation }) => ({
        headerTitle: "",
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
      name="MotorcycleScreen"
      component={MotorcycleScreen}
      options={({ navigation }) => ({
        headerTitle: "รถมอเตอร์ไซค์",
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
      name="VanScreen"
      component={VanScreen}
      options={({ navigation }) => ({
        headerTitle: "รถตู้",
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

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <Text style={styles.drawerHeadLabel}>TU AROUND</Text>
      <DrawerItem
        label="รถสาธารณะอื่นๆ"
        onPress={() => props.navigation.navigate("TransportScreen")}
        // icon={({ color, size }) => (
        //   <Ionicons name="car-sport-sharp" size={size} color="#000000" />
        // )}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
      />
      <DrawerItem
        label="ประกาศ"
        onPress={() => props.navigation.navigate("DashboardScreen")}
        // icon={({ color, size }) => (
        //   <MaterialIcons name="space-dashboard" size={size} color="#000000" />
        // )}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
      />
      <DrawerItem
        label="วิธีใช้งาน"
        onPress={() => props.navigation.navigate("HowToUseScreen")}
        // icon={({ color, size }) => (
        //   <Octicons name="question" size={size} color="#000000" />
        // )}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
      />
      <DrawerItem
        label="รายงานปัญหา"
        onPress={() => props.navigation.navigate("ReportScreen")}
        // icon={({ color, size }) => (
        //   <Octicons name="question" size={size} color="#000000" />
        // )}
        labelStyle={styles.drawerLabel}
        style={styles.drawerItem}
      />
    </DrawerContentScrollView>
  );
};

const App = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    fetchFonts().then(() => setFontLoaded(true));
  }, []);

  if (!fontLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

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
        <Drawer.Screen name="ReportScreen" component={ReportScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: 'Prompt-Bold', // ใช้ฟอนต์ที่โหล
    fontSize: 22,
    color: "#f65d3c",
    marginTop: 25,
  },
  iconStyle: {
    marginLeft: 20,
    marginTop: 30,
  },
  iconCloseStyle: {
    marginRight: 30, // ระยะห่างจากขอบขวา
    marginTop: 15, // ระยะห่างจากด้านบน
  },
  drawerHeadLabel: {
    fontFamily: 'Prompt-Bold', // ใช้ฟอนต์ที่โหลด
    color: 'pink',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
    color: "#f65d3c", // สีของชื่อใน Drawer
    fontSize: 25,
  },
  drawerItem: {
    marginVertical: 3, // ปรับให้ไอคอนชิดกับชื่อ
  },
  drawerLabel: {
    fontFamily: 'Prompt-Medium', // ใช้ฟอนต์ที่โหลด
    marginLeft: 10, // ปรับให้ชื่อชิดกับไอคอนมากขึ้น
    marginTop: 2,
    color: "#000000", // สีของชื่อใน Drawer
    fontSize: 16,
  },
});

export default App;
