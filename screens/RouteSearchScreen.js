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
import * as Font from 'expo-font'; // นำเข้า expo-font

const fetchFonts = () => {
  return Font.loadAsync({
    'Prompt-Regular': require('../assets/fonts/Prompt-Regular.ttf'), // ปรับเส้นทางฟอนต์ตามตำแหน่งที่เก็บ
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
  const [inputField, setInputField] = useState(null); // To determine which input field to update
  const [fontLoaded, setFontLoaded] = useState(false);

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
      <MaterialIcons name="stars" size={22} color="#FFA500" />
      <Text style={styles.placeText}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (!fontLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.dotColumn}>
          <Icon name="circle" size={10} color="#FFA500" style={styles.icon} />
          <Icon name="circle" size={7} color="#D3D3D3" style={styles.icon} />
          <Icon name="circle" size={7} color="#D3D3D3" style={styles.icon} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>จาก</Text>
          <TextInput
            style={styles.input}
            placeholder="ตำแหน่งปัจจุบัน"
            placeholderTextColor="#D3D3D3"
            value={startLocation}
            onChangeText={(text) => setStartLocation(text)}
            onFocus={() => setInputField("start")}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.dotColumn}>
          <Icon name="circle" size={7} color="#D3D3D3" style={styles.icon} />
          <Icon name="circle" size={7} color="#D3D3D3" style={styles.icon} />
          <Icon name="circle" size={10} color="#FFA500" style={styles.icon} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>ถึง</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            placeholderTextColor="#FFA500"
            value={endLocation}
            onChangeText={(text) => setEndLocation(text)}
            onFocus={() => setInputField("end")}
          />
        </View>
      </View>

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
        onPress={() => navigation.navigate("RouteScreen")}
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
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  input: {
    height: 40,
    fontSize: 14,
    color: "#FFA500",
    fontFamily: 'Prompt-Regular', // ใช้ฟอนต์ที่โหลด
  },
  label: {
    fontSize: 14,
    color: "#FFA500",
    fontFamily: 'Prompt-Regular', // ใช้ฟอนต์ที่โหลด
  },
  title: {
    fontSize: 16,
    color: "#d87c38",
    fontFamily: 'Prompt-Medium', // ใช้ฟอนต์ที่โหลด
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
    color: "#555",
    fontFamily: 'Prompt-Regular', // ใช้ฟอนต์ที่โหลด
  },
  button: {
    backgroundColor: "#FFA500",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: 'Prompt-Medium', // ใช้ฟอนต์ที่โหลด
  },
});

export default RouteSearchScreen;
