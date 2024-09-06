// DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as Font from 'expo-font';

const fetchFonts = () => {
  return Font.loadAsync({
    'Prompt-Regular': require('../assets/fonts/Prompt-Regular.ttf'),
    'Prompt-Bold': require('../assets/fonts/Prompt-Bold.ttf'),
    'Prompt-Medium': require('../assets/fonts/Prompt-Medium.ttf'), // ปรับเส้นทางฟอนต์ตามตำแหน่งที่เก็บ
  });
};

const DashboardScreen = () => {
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
          <Text style={styles.header1}>ประกาศ</Text>
          <Text style={styles.header2}>จากขนส่งภายในมหาวิทยาลัย</Text>
        </View>      
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
  
});

export default DashboardScreen;
