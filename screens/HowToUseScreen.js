// HowToUseScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator} from 'react-native';
import * as Font from 'expo-font';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // สำหรับการนำทาง

const images = [
  { 
    src: require('../assets/images/gradient-grainy-gradient-background_23-2149922200.jpg'), 
    description: { 
      bold: 'ตรวจสอบเส้นทางรถบัส', 
      normal: 'เลือกสายรถที่ต้องการเพื่อดูเส้นทางบนแผนที่ พร้อมข้อมูลสถานที่ที่รถจะผ่าน ช่วยวางแผนการเดินทางได้สะดวกขึ้น' 
    } 
  },
  { 
    src: require('../assets/images/gradient-grainy-gradient-background_23-2149922209.jpg'), 
    description: { 
      bold: 'ยืนยันตำแหน่งและเช็คจำนวนคน', 
      normal: 'กดปุ่ม Check-In เพื่อยืนยันตำแหน่งของคุณ ระบบจะแสดงจำนวนผู้โดยสารใกล้เคียงในแต่ละสถานี' 
    } 
  },
  {
    src: require('../assets/images/gradient-grainy-gradient-background_23-2149922231.jpg'),
    description: {
      bold: 'ตาวจสอบสถานที่ของรถสาธารณะ',
      normal: 'กดไอคอนรถสาธารณะต่างๆ เพื่อแสดงสถานีของรถสาธารณะนั้นๆ'
    }
  },
  { 
    src: require('../assets/images/gradient-grainy-gradient-background_23-2149922238.jpg'), 
    description: { 
      bold: 'ดูข้อมูลรถมอไซค์และรถตู้', 
      normal: 'ตรวจสอบรายละเอียดราคาค่าโดยสาร พร้อมสถานที่ต้นทางและปลายทางได้ง่ายๆ เพื่อช่วยวางแผนการเดินทางอย่างสะดวก' 
    } 
  },
  {
    src: require('../assets/images/gradient-grainy-gradient-background_23-2149922238.jpg'),
    description: {
      bold: 'แจ้งปัญหารถบัสที่คุณพบ',
      normal: 'พบปัญหาเกี่ยวกับรถบัส? ไม่ว่าจะเป็นการล่าช้าหรือปัญหาเส้นทาง คุณสามารถรายงานปัญหาที่พบผ่านหน้านี้เพื่อการแก้ไขอย่างรวดเร็ว'
    }
  }
];

const fetchFonts = () => {
  return Font.loadAsync({
    'Prompt-Regular': require('../assets/fonts/Prompt-Regular.ttf'),
    'Prompt-Bold': require('../assets/fonts/Prompt-Bold.ttf'),
    'Prompt-Medium': require('../assets/fonts/Prompt-Medium.ttf'),
  });
};

const HowToUseScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation(); // สำหรับการนำทาง

  useEffect(() => {
    fetchFonts().then(() => setFontLoaded(true));
  }, []);

  if (!fontLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleStart = () => {
    navigation.navigate('Home'); // กลับไปยังหน้า HomeScreen
  };

  return (
    <View style={styles.container}>
      <Image source={images[currentIndex].src} style={styles.image} />

      <View style={styles.textContainer}>
        <Text style={styles.boldText}>{images[currentIndex].description.bold}</Text>
        <Text style={styles.normalText}>{images[currentIndex].description.normal}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {currentIndex > 0 && currentIndex < images.length - 1 && (
          <TouchableOpacity onPress={handlePrevious} style={[styles.button, styles.leftbutton]}>
            <AntDesign name="leftcircleo" size={40} color="#1e1e1e" />
          </TouchableOpacity>
        )}

        {currentIndex < images.length - 1 && (
          <TouchableOpacity onPress={handleNext} style={[styles.button, styles.rightbutton]}>
            <AntDesign name="rightcircle" size={40} color="#1e1e1e" />
          </TouchableOpacity>
        )}

        {currentIndex < images.length - 1 && (
          <View style={styles.circleContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.circle,
                  { backgroundColor: currentIndex === index ? '#1e1e1e' : '#cccccc' },
                ]}
              />
            ))}
          </View>
        )}

        {/* หน้า Description 5: เพิ่มปุ่ม "เริ่มต้น" */}
        {currentIndex === images.length - 1 && (
          <TouchableOpacity onPress={handleStart} style={styles.startButton}>
            <Text style={styles.startButtonText}>เริ่มต้นใช้งาน</Text>
          </TouchableOpacity>
        )}
      </View>
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
  image: {
    position: 'absolute',
    top: 160,
    width: 300,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 50,
  },
  textContainer: {
    position: 'absolute',
    top: 485,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  boldText: {
    fontSize: 22,
    textAlign: 'center',
    color: '#f65d3c',
    fontFamily: 'Prompt-Medium',
  },
  normalText: {
    fontSize: 16,
    color: '#1e1e1e',
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Prompt-Regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    bottom: -27,
  },
  leftbutton: {
    position: 'absolute',
    left: 35,
  },
  rightbutton: {
    position: 'absolute',
    right: 35,
  },
  circleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -15,
    left: 0,
    right: 0,
  },
  circle: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  startButton: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: -20,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Prompt-Medium',
    marginHorizontal: 5,
    
  },
});

export default HowToUseScreen;
