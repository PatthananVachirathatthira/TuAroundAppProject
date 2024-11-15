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
    { id: "1", name: "SC CANTEEN" },
    { id: "2", name: "SIIT" },
    { id: "3", name: "สถานีขนส่ง รถตู้" },
  ];

  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [inputField, setInputField] = useState(null);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState([]); // สำหรับเก็บสถานที่ที่กรองแล้ว

  useEffect(() => {
    fetchFonts().then(() => setFontLoaded(true));
  }, []);

  // ฟังก์ชันสำหรับกรองสถานที่
  const filterPlaces = (text) => {
    const filtered = places.filter(place => 
      place.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredPlaces(filtered);
  };

  const renderPlace = ({ item }) => (
    <TouchableOpacity
      style={styles.placeContainer}
      onPress={() => {
        if (inputField === "start") {
          setStartLocation(item.name);
        } else if (inputField === "end") {
          setEndLocation(item.name);
        }
        setFilteredPlaces([]); // รีเซ็ตคำแนะนำเมื่อเลือกสถานที่
      }}
    >
      <MaterialIcons name="stars" size={22} color="#f65d3c" />
      <Text style={styles.placeText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleSearchRoute = () => {
    if (!startLocation) {
      setStartLocation("ตำแหน่งปัจจุบัน");
    }

    if (!endLocation) {
      setErrorMessage("กรุณาเลือกสถานีปลายทาง");
    } else {
      setErrorMessage("");
      navigation.navigate("RouteScreen", { start: startLocation, end: endLocation });
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
            value={startLocation}
            onChangeText={(text) => {
              setStartLocation(text);
              filterPlaces(text); // เรียกใช้ฟังก์ชันกรองสถานที่
              setInputField("start"); // ตั้งค่าฟิลด์ที่กำลังแก้ไข
            }}
            onFocus={() => setInputField("start")}
          />
          {/* แสดงคำแนะนำเมื่อมีการกรอกข้อมูล */}
          {inputField === "start" && filteredPlaces.length > 0 && (
            <FlatList
              data={filteredPlaces}
              renderItem={renderPlace}
              keyExtractor={(item) => item.id}
              style={styles.suggestionList}
            />
          )}
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
            onChangeText={(text) => {
              setEndLocation(text);
              filterPlaces(text); // เรียกใช้ฟังก์ชันกรองสถานที่
              setInputField("end"); // ตั้งค่าฟิลด์ที่กำลังแก้ไข
            }}
            onFocus={() => setInputField("end")}
          />
          {/* แสดงคำแนะนำเมื่อมีการกรอกข้อมูล */}
          {inputField === "end" && filteredPlaces.length > 0 && (
            <FlatList
              data={filteredPlaces}
              renderItem={renderPlace}
              keyExtractor={(item) => item.id}
              style={styles.suggestionList}
            />
          )}
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
  suggestionList: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginTop: 5,
    position: 'absolute',
    zIndex: 1,
    width: '100%',
  },
  errorContainer: {
    backgroundColor: "#ffcccb",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  errorText: {
    color: "#b22222",
    fontFamily: 'Prompt-Bold',
    textDecorationLine: 'underline',
  },
});

export default RouteSearchScreen;
