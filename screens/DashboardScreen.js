import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import * as Font from 'expo-font';

const fetchFonts = () => {
  return Font.loadAsync({
    'Prompt-Regular': require('../assets/fonts/Prompt-Regular.ttf'),
    'Prompt-Bold': require('../assets/fonts/Prompt-Bold.ttf'),
    'Prompt-Medium': require('../assets/fonts/Prompt-Medium.ttf'),
  });
};

const { width } = Dimensions.get('window'); // ใช้ขนาดของหน้าจอ

const DashboardScreen = ({ navigation }) => {
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AnnounceScreen', { type: 'A' })}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitleText}>การปรัปปรุง EV สาย A</Text>
            <Text style={styles.buttonText}>32 สิงหา 2024-5.00</Text>
          </View>
          <AntDesign
            name="right"
            size={22}
            color="#f65d3c"
            style={styles.icon}
          />
        </TouchableOpacity>
        <View style={styles.separator} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AnnounceScreen', { type: 'B' })}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitleText}>การปรัปปรุง EV สาย B</Text>
            <Text style={styles.buttonText}>32 สิงหา 2024-5.00</Text>
          </View>
          <AntDesign
            name="right"
            size={22}
            color="#f65d3c"
            style={styles.icon}
          />
        </TouchableOpacity>
        <View style={styles.separator} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AnnounceScreen', { type: 'C' })}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonTitleText}>การปรัปปรุง EV สาย C</Text>
            <Text style={styles.buttonText}>32 สิงหา 2024-5.00</Text>
          </View>
          <AntDesign
            name="right"
            size={22}
            color="#f65d3c"
            style={styles.icon}
          />
        </TouchableOpacity>
        <View style={styles.separator} />
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
  buttonContainer: {
    width: width * 0.9, // ใช้ขนาดหน้าจอเพื่อให้ปุ่มไม่เต็มขนาด
    height: 75,
    marginVertical: 5,
    position: 'relative',
  },
  button: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 0,
    borderColor: 'transparent',
    borderWidth: 0,
    shadowColor: 'transparent',
    elevation: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  buttonTitleText: {
    color: "#f65d3c",
    fontSize: 18,
    fontFamily: "Prompt-Medium",
    marginTop: -10,
    marginBottom: -2,
    paddingLeft: 12,
  },
  buttonText: {
    color: "#d6b493",
    fontSize: 15,
    fontFamily: "Prompt-Regular",
    paddingLeft: 12,
  },
  icon: {
    marginHorizontal: 10,
  },
  separator: {
    height: 1.5,
    backgroundColor: '#ecc69f',
    width: '95%',
    position: 'absolute',
    bottom: 0,
    left: 10,
    zIndex: 1, // ทำให้แน่ใจว่าเส้นแบ่งจะอยู่เหนือปุ่ม
  },
});

export default DashboardScreen;
