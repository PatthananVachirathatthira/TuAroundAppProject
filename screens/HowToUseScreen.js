import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // นำเข้าไอคอนจาก AntDesign

const images = [
  { 
    src: require('../assets/images/gradient-grainy-gradient-background_23-2149922200.jpg'), 
    description: { 
      bold: 'Description 1', 
      normal: 'Proident aliqua culpa aliqua cupidatat tempor excepteur nulla in.' 
    } 
  },
  { 
    src: require('../assets/images/gradient-grainy-gradient-background_23-2149922209.jpg'), 
    description: { 
      bold: 'Description 2', 
      normal: 'Proident proident cupidatat eiusmod exercitation voluptate exercitation enim ullamco adipisicing et.' 
    } 
  },
  {
    src: require('../assets/images/gradient-grainy-gradient-background_23-2149922231.jpg'),
    description: {
      bold: 'Description 3',
      normal: 'Laborum laborum officia eiusmod non consequat deserunt nisi.'
    }
  },
  { 
    src: require('../assets/images/gradient-grainy-gradient-background_23-2149922238.jpg'), 
    description: { 
      bold: 'Description 4', 
      normal: 'Aliqua id nostrud est labore sit velit tempor elit commodo officia tempor exercitation.' 
    } 
  },
];

const HowToUseScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // ฟังก์ชันเลื่อนไปทางขวา
  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // ฟังก์ชันเลื่อนไปทางซ้าย
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // เลือกไอคอนสำหรับปุ่มซ้าย
  const leftIcon = currentIndex === images.length - 1 ? 'leftcircle' : 'leftcircleo';

  // เลือกไอคอนสำหรับปุ่มขวา
  const rightIcon = currentIndex === images.length - 1 ? 'rightcircleo' : 'rightcircle';

  return (
    <View style={styles.container}>
      <Image source={images[currentIndex].src} style={styles.image} />

      <View style={styles.textContainer}>
        <Text style={styles.boldText}>{images[currentIndex].description.bold}</Text>
        <Text style={styles.normalText}>{images[currentIndex].description.normal}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {currentIndex > 0 && (
          <TouchableOpacity onPress={handlePrevious} style={[styles.button, styles.leftbutton]}>
            <AntDesign name={leftIcon} size={40} color="black" />
          </TouchableOpacity>
        )}

        {currentIndex < images.length - 1 && (
          <TouchableOpacity onPress={handleNext} style={[styles.button, styles.rightbutton]}>
            <AntDesign name={rightIcon} size={40} color="black" />
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
    top: 500,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  boldText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  normalText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftbutton: {
    position: 'absolute',
    left: 35,
  },
  rightbutton: {
    position: 'absolute',
    right: 35,
  },
});

export default HowToUseScreen;
