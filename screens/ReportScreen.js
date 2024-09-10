import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Button,
  Image,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import * as Font from "expo-font";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

const fetchFonts = () => {
  return Font.loadAsync({
    "Prompt-Regular": require("../assets/fonts/Prompt-Regular.ttf"),
    "Prompt-Bold": require("../assets/fonts/Prompt-Bold.ttf"),
    "Prompt-Medium": require("../assets/fonts/Prompt-Medium.ttf"),
  });
};

const ReportScreen = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [problem, setProblem] = useState(""); 
  const [description, setDescription] = useState(""); 
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState(null);
  const navigation = useNavigation(); 

  useEffect(() => {
    fetchFonts().then(() => setFontLoaded(true));
  }, []);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleSubmit = () => {
    // ตรวจสอบว่ากรอกข้อมูลครบถ้วนหรือไม่
    if (!problem || !description || !date) {
      Alert.alert("กรุณาตรวจสอบข้อมูลที่ต้องกรอกให้ครบถ้วน");
      return;
    }

    // ถ้าข้อมูลครบแล้ว ให้ดำเนินการส่งข้อมูล
    Alert.alert("ส่งข้อมูลเรียบร้อยแล้ว");
  };

  if (!fontLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={27} color="#f65d3c" />
        <Text style={styles.backText}>กลับ</Text>
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.header1}>รายงานปัญหา</Text>
        <Text style={styles.header2}>ขนส่งภายในมหาวิทยาลัย</Text>
      </View>

      <Text style={styles.label}>ปัญหา*</Text>
      <TextInput
        style={styles.input}
        value={problem}
        onChangeText={setProblem}
      />

      <Text style={styles.label}>วันที่รายงานปัญหา*</Text>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.datePickerText}>
          {date ? date.toLocaleDateString() : "XX/XX/XXXX"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Text style={styles.label}>คำอธิบาย*</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>แนบรูปภาพ (optional)</Text>
      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Ionicons
          name="camera-outline"
          size={50}
          color="#575757"
          style={styles.cameraIcon}
        />
        <Text style={styles.imageButtonText}>เลือกภาพ</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setProblem("");
            setDescription("");
            setDate(new Date());
            setImage(null);
          }}
        >
          <Text style={styles.cancelButtonText}>ยกเลิก</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>ส่ง</Text>
        </TouchableOpacity>
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
    alignItems: "flex-start",
    marginLeft: 20,
    width: "85%",
    marginBottom: 15,
  },
  header1: {
    fontSize: 25,
    fontFamily: "Prompt-Bold",
    color: "#f65d3c",
    marginBottom: 0,
  },
  header2: {
    fontSize: 23,
    fontFamily: "Prompt-Medium",
    color: "#1e1e1e",
    marginBottom: 5,
  },
  label: {
    width: "85%",
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 20,
    color: "#575757",
  },
  input: {
    width: "85%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    fontFamily: "Prompt-Regular",
    color: '#575757',
  },
  datePickerButton: {
    width: "85%",
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 15,
    justifyContent: "center",
  },
  datePickerText: {
    fontFamily: "Prompt-Regular",
    color: "#575757",
  },
  imageButton: {
    width: "85%",
    height: 125, // เพิ่มความสูง
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center", // ทำให้ไอคอนอยู่ตรงกลาง
    position: "relative", // สำหรับการจัดตำแหน่งข้อความ
  },
  cameraIcon: {
    marginTop: -20,
  },
  imageButtonText: {
    fontFamily: "Prompt-Regular",
    color: "#575757",
    position: "absolute",
    bottom: 25, // วางไว้ด้านล่างสุด
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginTop: 12,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 30,
    width: "47%",
    alignItems: "center",
  },
  cancelButtonText: {
    fontFamily: "Prompt-Medium",
    color: "white",
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: "#f65d3c",
    padding: 15,
    borderRadius: 30,
    width: "47%",
    alignItems: "center",
  },
  submitButtonText: {
    fontFamily: "Prompt-Medium",
    color: "white",
    fontSize: 18,
  },
});

export default ReportScreen;
