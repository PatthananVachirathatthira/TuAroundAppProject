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

const fetchFonts = () => {
  return Font.loadAsync({
    "Prompt-Regular": require("../assets/fonts/Prompt-Regular.ttf"),
    "Prompt-Bold": require("../assets/fonts/Prompt-Bold.ttf"),
    "Prompt-Medium": require("../assets/fonts/Prompt-Medium.ttf"),
  });
};

const TransportScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);

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
      <TouchableOpacity style={styles.button}>
        <LinearGradient
          colors={["#f65d3c", "#f65d3c"]} // สีส้มและแดง
          start={[0, 0]} // จุดเริ่มต้นของ gradient
          end={[1, 1]} // จุดสิ้นสุดของ gradient
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
          colors={["#f65d3c", "#f65d3c"]} // สีส้มและแดง
          start={[0, 0]} // จุดเริ่มต้นของ gradient
          end={[1, 1]} // จุดสิ้นสุดของ gradient
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
          colors={["#f65d3c", "#f65d3c"]} // สีส้มและแดง
          start={[0, 0]} // จุดเริ่มต้นของ gradient
          end={[1, 1]} // จุดสิ้นสุดของ gradient
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
    alignItems: 'flex-start', // ชิดซ้ายทั้งหมด
    marginLeft: 27,
    width: '85%', // ทำให้ข้อความใช้พื้นที่ตามความกว้างที่ต้องการ
    marginBottom: 15, // เพิ่มระยะห่างระหว่างข้อความกับปุ่ม
  },
  header1: {
    fontSize: 25,
    fontFamily: 'Prompt-Bold',
    color: '#f65d3c',
    marginBottom: 0, // ระยะห่างระหว่างข้อความและปุ่ม
  },
  header2: {
    fontSize: 23,
    fontFamily: 'Prompt-Medium',
    color: '#1e1e1e',
    marginBottom: 5, // ระยะห่างระหว่างข้อความและปุ่ม
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
    borderRadius: 25, // มุมมนเหมือนปุ่ม
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
