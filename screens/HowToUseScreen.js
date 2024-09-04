import React, { useState, useRef } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import Swiper from 'react-native-swiper';
import { AntDesign } from "@expo/vector-icons";

const HowToUseScreen = ({ navigation }) => {
  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const texts = [
    "นี่คือรูปหมา",
    "นี่คือรูปแมว",
  ];

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1); // เลื่อนไปยังภาพถัดไป
    }
  };

  const handlePrevious = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(-1); // เลื่อนไปยังภาพก่อนหน้า
    }
  };

  const handleIndexChanged = (index) => {
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        style={styles.wrapper}
        showsPagination={false}
        loop={false}
        onIndexChanged={handleIndexChanged}
      >
        <View style={styles.slide}>
          <Image
            source={require('../assets/icon.png')} // รูปหมา
            style={styles.image}
          />
        </View>
        <View style={styles.slide}>
          <Image
            source={require('../assets/images/close-up-portrait-beautiful-cat.jpg')} // รูปแมว
            style={styles.image}
          />
        </View>
      </Swiper>

      <View style={styles.textContainer}>
        <Text style={styles.text}>{texts[currentIndex]}</Text>
      </View>

      {currentIndex > 0 && (
        <TouchableOpacity
          style={[styles.button, styles.leftButton]}
          onPress={handlePrevious}
        >
          <AntDesign name="leftcircle" size={30} color="#2a2a2a" />
        </TouchableOpacity>
      )}

      {currentIndex < texts.length - 1 && (
        <TouchableOpacity
          style={[styles.button, styles.rightButton]}
          onPress={handleNext}
        >
          <AntDesign name="rightcircle" size={30} color="#2a2a2a" />
        </TouchableOpacity>
      )}
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
  textContainer: {
    marginVertical: 1, // ระยะห่างระหว่างรูปภาพและข้อความ
    alignItems: 'center',
    bottom: 200,
  },
  text: {
    fontSize: 16,
    color: '#333',
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
