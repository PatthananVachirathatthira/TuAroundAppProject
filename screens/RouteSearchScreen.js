import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Font from 'expo-font';

const fetchFonts = () => {
  return Font.loadAsync({
    'Prompt-Regular': require('../assets/fonts/Prompt-Regular.ttf'),
    'Prompt-Bold': require('../assets/fonts/Prompt-Bold.ttf'),
    'Prompt-Medium': require('../assets/fonts/Prompt-Medium.ttf'),
  });
};

const RouteSearchScreen = ({ navigation }) => {
  const places = [
    { id: "1", name: "หอสมุดป๋วย" },
    { id: "2", name: "อาคารเรียนรวม 1" },
    { id: "3", name: "กรีนแคนทีน" },
  ];

  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [inputField, setInputField] = useState(null);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // เพิ่ม state สำหรับแสดงข้อความผิดพลาด

  useEffect(() => {
    fetchFonts().then(() => setFontLoaded(true));
  }, []);

  const renderPlace = ({ item }) => (
    <TouchableOpacity
      style={styles.placeContainer}
      onPress={() => {
        if (inputField === "start") {
          setStartLocation(item.name);
        } else if (inputField === "end") {
          setEndLocation(item.name);
        }
      }}
    >
      <MaterialIcons name="stars" size={22} color="#f65d3c" />
      <Text style={styles.placeText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleSearchRoute = () => {
    if (!startLocation) {
      setStartLocation("ตำแหน่งปัจจุบัน"); // ตั้งค่าเริ่มต้นถ้าผู้ใช้ไม่กรอกค่า
    }
    
    if (!endLocation) {
      setErrorMessage("กรุณาเลือกสถานีปลายทาง"); // แสดงข้อความผิดพลาดถ้าไม่กรอกปลายทาง
    } else {
      setErrorMessage(""); // ล้างข้อความผิดพลาด
      navigation.navigate("RouteScreen");
    }
  };

  if (!fontLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.dotColumn}>
          <Icon name="circle" size={10} color="#f65d3c" style={styles.icon} />
          <Icon name="circle" size={7} color="#D3D3D3" style={styles.icon} />
          <Icon name="circle" size={7} color="#D3D3D3" style={styles.icon} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>จาก</Text>
          <TextInput
            style={styles.input}
            placeholder="ตำแหน่งปัจจุบัน"
            placeholderTextColor="#D3D3D3"
            value={startLocation} // ถ้าไม่ได้กรอกให้ใช้ค่าเริ่มต้น
            onChangeText={(text) => setStartLocation(text)}
            onFocus={() => setInputField("start")}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.dotColumn}>
          <Icon name="circle" size={7} color="#D3D3D3" style={styles.icon} />
          <Icon name="circle" size={7} color="#D3D3D3" style={styles.icon} />
          <Icon name="circle" size={10} color="#f65d3c" style={styles.icon} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>ถึง</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            placeholderTextColor="#f65d3c"
            value={endLocation}
            onChangeText={(text) => setEndLocation(text)}
            onFocus={() => setInputField("end")}
          />
        </View>
      </View>

      {/* แสดงข้อความผิดพลาด */}
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* Recommended Places List */}
      <Text style={styles.title}>สถานที่แนะนำ</Text>
      <View style={styles.separator} />
      <FlatList
        data={places}
        renderItem={renderPlace}
        keyExtractor={(item) => item.id}
      />
      
      {/* Button to Show Route Information */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSearchRoute}
      >
        <Text style={styles.buttonText}>ค้นหาเส้นทาง</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 25,
    backgroundColor: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dotColumn: {
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 8,
  },
  icon: {
    marginBottom: 8,
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  input: {
    height: 40,
    fontSize: 14,
    color: "#575757",
    fontFamily: 'Prompt-Regular',
  },
  label: {
    fontSize: 14,
    color: "#f65d3c",
    fontFamily: 'Prompt-Medium',
  },
  title: {
    fontSize: 16,
    color: "#f65d3c",
    fontFamily: 'Prompt-Medium',
  },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  placeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  placeText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#f65d3cf",
    fontFamily: 'Prompt-Regular',
  },
  button: {
    backgroundColor: "#f65d3c",
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontFamily: 'Prompt-Regular',
  },
  errorContainer: {
    backgroundColor: "#ffcccb", // สีพื้นหลังกล่องข้อความผิดพลาด
    borderRadius: 10, // ทำให้เป็นสี่เหลี่ยมมน
    padding: 10,
    marginVertical: 10,
  },
  errorText: {
    color: "#b22222", // สีข้อความ
    fontFamily: 'Prompt-Bold', // เปลี่ยนเป็นฟอนต์หนา
    textDecorationLine: 'underline', // เพิ่มการขีดเส้นใต้
  },
});

export default RouteSearchScreen;
