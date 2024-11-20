import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
  Pressable,
  Animated,
  Easing,
  Platform,
} from "react-native";
import * as Font from "expo-font";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import { database, ref, set, push } from "../firebaseConfig";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// ฟังก์ชันสำหรับส่งข้อมูลไปยัง Firebase
const uploadReport = (problem, description, date, image) => {
  const reportRef = ref(database, "Report/File");
  const newReportRef = push(reportRef);

  const reportData = {
    Date: date.toLocaleDateString(),
    Description: description,
    Pic: image || "",
    Topic: problem,
  };

  set(newReportRef, reportData)
    .then(() => {
      console.log("Report submitted successfully!");
    })
    .catch((error) => {
      console.error("Error submitting report: ", error);
    });
};

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
  const [images, setImages] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    // โหลดฟอนต์และขออนุญาตเข้าถึงคลังรูปภาพ
    fetchFonts().then(() => setFontLoaded(true));

    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("ขออภัย, แอปต้องการการอนุญาตเพื่อเข้าถึงรูปภาพ");
        }
      }
    })();
  }, []);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };
  // เลือกรูป

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // ปิด allowsEditing เพื่อใช้งานกับ allowsMultipleSelection
      allowsMultipleSelection: true, // เปิดให้เลือกรูปหลายรูป
      aspect: [4, 3],
      quality: 1,
    });

    if (result && !result.canceled && result.assets) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages(selectedImages);
    } else {
      console.log("No images selected or operation canceled.");
    }
  };

  const uploadImagesToFirebase = async (imageUris) => {
    const storage = getStorage();
    const downloadURLs = [];

    for (const imageUri of imageUris) {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageRef = storageRef(
        storage,
        `reports/${new Date().getTime()}.jpg`
      );
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      downloadURLs.push(downloadURL);
    }
    return downloadURLs; // คืนค่ารายการ URL ของภาพ
  };

  const handleSubmit = async () => {
    if (!problem || !description || !date) {
      setModalVisible(true);
      return;
    }

    let imageUrls = [];
    if (images.length > 0) {
      // อัปโหลดภาพและรับ URL
      imageUrls = await uploadImagesToFirebase(images);
    }

    // ส่งรายงานไปยัง Firebase
    uploadReport(problem, description, date, imageUrls); // ส่งอาร์เรย์ของ URL

    // แสดงข้อความสำเร็จและรีเซ็ตฟอร์ม
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000); // ซ่อนข้อความหลังจาก 3 วินาที
    setProblem("");
    setDescription("");
    setDate(new Date());
    setImages([]); // รีเซ็ตภาพที่เลือก
  };

  if (!fontLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const animatedStyle = {
    opacity: animatedValue,
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0], // Move from below the screen to its final position
        }),
      },
    ],
  };

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
      {images.length > 0 && (
        <View style={styles.imagePreviewContainer}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageItem}>
              <Image source={{ uri: image }} style={styles.imagePreview} />
              <Text style={styles.imagePreviewText}>เลือกภาพนี้</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            setProblem("");
            setDescription("");
            setDate(new Date());
            setImages([]);
          }}
        >
          <Text style={styles.cancelButtonText}>ยกเลิก</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>ส่ง</Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            กรุณาตรวจสอบข้อมูลที่{"\n"}ต้องกรอกให้ครบถ้วน
          </Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>ตกลง</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {showSuccess && (
        <View style={styles.successMessageContainer}>
          <Animated.View style={[styles.successMessage, animatedStyle]}>
            <Text style={styles.successText}>ส่งข้อมูลสำเร็จ!</Text>
          </Animated.View>
        </View>
      )}
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
    color: "#575757",
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
    height: 125,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cameraIcon: {
    marginTop: -20,
  },
  imageButtonText: {
    fontFamily: "Prompt-Regular",
    color: "#575757",
    position: "absolute",
    bottom: 25,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginTop: 12,
  },
  cancelButton: {
    backgroundColor: "rgba(203, 203, 203, 0.59)",
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
  modal: {
    justifyContent: "center",
    alignItems: "center", 
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 25, // มุมมนของ modal
    alignItems: "center", // จัดให้ข้อความและปุ่มอยู่กลาง
  },
  modalText: {
    fontFamily: "Prompt-Regular", // ใช้ฟอนต์ Prompt-Medium
    fontSize: 18,
    color: "#1e1e1e", // สีข้อความ
    padding: 20,
    marginBottom: 5, // ระยะห่างจากปุ่ม
    textAlign: "center", // จัดข้อความให้อยู่กลาง
    lineHeight: 27,
  },
  modalButton: {
    backgroundColor: "#f65d3c", // สีพื้นหลังปุ่ม
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 30, // มุมมนของปุ่ม
    width: "100%", // ปรับความกว้างของปุ่ม
    alignItems: "center", // จัดปุ่มให้อยู่กลาง
  },
  modalButtonText: {
    fontFamily: "Prompt-Medium", // ใช้ฟอนต์ Prompt-Medium
    color: "white",
    fontSize: 16,
  },
  successMessageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  successMessage: {
    backgroundColor: "#1e1e1e", // สีพื้นหลังของกล่องข้อความสำเร็จ
    width: "50%", // กำหนดความกว้างของกล่อง
    maxWidth: 300, // กำหนดความกว้างสูงสุดของกล่อง
    borderRadius: 30, // มุมมนของกล่อง
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // เงาของกล่อง (Android)
    shadowColor: "#000", // เงาของกล่อง (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  successText: {
    fontFamily: "Prompt-Medium",
    fontSize: 18,
    color: "#f65d3c", // สีข้อความของกล่องสำเร็จ
    textAlign: "center",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  imageItem: {
    width: "48%", // จัดให้แสดง 2 รูปต่อแถว
    marginBottom: 10,
  },
  imagePreview: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
});

export default ReportScreen;
