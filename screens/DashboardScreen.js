// DashboardScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DashboardScreen = () => {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.text}>Dashboard</Text> */}
      </View>
    );
  };
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start', // จัดตำแหน่งในแนวตั้งให้เป็นกลาง
      alignItems: 'center',
      backgroundColor: 'white',
      paddingTop: 70, // ระยะห่างจากขอบบน (header)
    },
    text: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

export default DashboardScreen;
