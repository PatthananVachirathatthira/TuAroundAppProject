// HowToUseScreen.js
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Swiper from 'react-native-swiper';
import { AntDesign } from "@expo/vector-icons";

const HowToUseScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Swiper
        style={styles.wrapper}
        showsPagination={false} // ซ่อนจุดแสดงสถานะ
        loop={false} // ไม่ทำการวนลูป
      >
        <View style={styles.slide}>
          <Image
            source={{ uri: 'https://www.freepik.com/free-photo/close-up-portrait-beautiful-cat_21194112.htm#fromView=search&page=1&position=12&uuid=932eea98-4240-4863-bfde-0879b55136e9' }} // เปลี่ยน URL เป็น URL ของรูปภาพของคุณ
            style={styles.image}
          />
        </View>
        <View style={styles.slide}>
          <Image
            source={{ uri: 'https://example.com/image2.png' }} // เปลี่ยน URL เป็น URL ของรูปภาพของคุณ
            style={styles.image}
          />
        </View>
        {/* เพิ่ม View และ Image สำหรับแต่ละภาพที่ต้องการ */}
      </Swiper>

      <TouchableOpacity
        style={[styles.button, styles.leftButton]}
        onPress={() => { /* ใช้ swiper API เพื่อเลื่อนไปยังภาพก่อนหน้า */ }}
      >
        <AntDesign name="leftcircle" size={30} color="#2a2a2a" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.rightButton]}
        onPress={() => { /* ใช้ swiper API เพื่อเลื่อนไปยังภาพถัดไป */ }}
      >
        <AntDesign name="rightcircle" size={30} color="#2a2a2a" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  wrapper: {
    height: '80%', // ขนาดของ swiper
    width: '100%', // ขนาดของ swiper
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300, // ขนาดของรูปภาพ
    height: 300, // ขนาดของรูปภาพ
  },
  button: {
    position: 'absolute',
    bottom: 20,
    padding: 25,
  },
  leftButton: {
    left: 10,
  },
  rightButton: {
    right: 10,
  },
});

export default HowToUseScreen;
