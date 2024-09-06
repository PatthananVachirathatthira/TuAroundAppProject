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
import { LinearGradient } from "expo-linear-gradient"; // นำเข้า LinearGradient
import { useNavigation } from "@react-navigation/native"; // นำเข้า useNavigation

const fetchFonts = () => {
  return Font.loadAsync({
    "Prompt-Regular": require("../assets/fonts/Prompt-Regular.ttf"),
    "Prompt-Bold": require("../assets/fonts/Prompt-Bold.ttf"),
    "Prompt-Medium": require("../assets/fonts/Prompt-Medium.ttf"),
  });
};

const ReportScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation(); // สร้าง navigation

  useEffect(() => {
    fetchFonts().then(() => setFontLoaded(true));
  }, []);

  if (!fontLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()} // เมื่อกดปุ่มนี้จะกลับไปหน้าก่อนหน้านี้
      >
        <Feather name="arrow-left" size={27} color="#f65d3c" />
        <Text style={styles.backText}>กลับ</Text>
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.header1}>รถสาธารณะ</Text>
        <Text style={styles.header2}>ภายในมหาวิทยาลัย</Text>
      </View>
      <TouchableOpacity style={styles.button}>
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
      <TouchableOpacity style={styles.button}>
        <LinearGradient
          colors={["#f65d3c", "#f65d3c"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>รถเมล์</Text>
          <Feather
            name="arrow-up-right"
            size={27}
            color="#fffbf7"
            style={styles.icon}
          />
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 40,
    left: 20,
  },
  backText: {
    marginLeft: 5,
    fontSize: 18,
    color: "#f65d3c",
    fontFamily: "Prompt-Regular",
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

export default ReportScreen;
