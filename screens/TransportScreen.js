import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as Font from "expo-font";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from '@react-navigation/native'; // นำเข้า useNavigation

const fetchFonts = () => {
  return Font.loadAsync({
    "Prompt-Regular": require("../assets/fonts/Prompt-Regular.ttf"),
    "Prompt-Bold": require("../assets/fonts/Prompt-Bold.ttf"),
    "Prompt-Medium": require("../assets/fonts/Prompt-Medium.ttf"),
  });
};

const TransportScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation(); // สร้างตัวแปรเพื่อใช้ในการนำทาง

  useEffect(() => {
    fetchFonts().then(() => setFontLoaded(true));
  }, []);

  if (!fontLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.header1}>รถสาธารณะ</Text>
        <Text style={styles.header2}>ภายในมหาวิทยาลัย</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MotorcycleScreen")} // นำทางไปยัง MotorcycleScreen
      >
        <LinearGradient
          colors={["#f65d3c", "#f65d3c"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>รถมอเตอร์ไซค์</Text>
          <Feather
            name="arrow-up-right"
            size={27}
            color="#fffbf7"
            style={styles.icon}
          />
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("VanScreen")} // นำทางไปยัง VanScreen
      >
        <LinearGradient
          colors={["#f65d3c", "#f65d3c"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>รถตู้</Text>
          <Feather
            name="arrow-up-right"
            size={27}
            color="#fffbf7"
            style={styles.icon}
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: 90,
  },
  textContainer: {
    alignItems: 'flex-start',
    marginLeft: 20,
    width: '85%',
    marginBottom: 15,
  },
  header1: {
    fontSize: 25,
    fontFamily: 'Prompt-Bold',
    color: '#f65d3c',
    marginBottom: 0,
  },
  header2: {
    fontSize: 23,
    fontFamily: 'Prompt-Medium',
    color: '#1e1e1e',
    marginBottom: 5,
  },
  button: {
    marginVertical: 11,
    width: "88%",
    height: 90,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 35,
  },
  buttonText: {
    color: "#fffbf7",
    fontSize: 25,
    fontFamily: "Prompt-Regular",
    marginBottom: 5,
  },
  icon: {
    position: "absolute",
    top: 15,
    right: 15,
  },
});

export default TransportScreen;
