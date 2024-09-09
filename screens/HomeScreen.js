//HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Font from 'expo-font'; // นำเข้า expo-font
import MyMapComponent from '../components/MyMapComponent'; // นำเข้า MyMapComponent

const fetchFonts = () => {
  return Font.loadAsync({
    'Prompt-Regular': require('../assets/fonts/Prompt-Regular.ttf'),
    'Prompt-Bold': require('../assets/fonts/Prompt-Bold.ttf'),
    'Prompt-Medium': require('../assets/fonts/Prompt-Medium.ttf'), // ปรับเส้นทางฟอนต์ตามตำแหน่งที่เก็บ
  });
};

const HomeScreen = ({ navigation }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    fetchFonts().then(() => setFontLoaded(true));
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const selectOption = (option) => {
    setDropdownVisible(false);
    console.log('Selected:', option);
  };

  if (!fontLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Pressable
          style={styles.searchBarContainer}
          onPress={() => navigation.navigate('RouteSearchScreen')}
          android_ripple={{ color: '#ddd' }} // Effect on Android
        >
          <TextInput
            style={styles.searchBar}
            placeholder="คุณจะไปที่ไหน"
            placeholderTextColor="#888"
            editable={false}
          />
          <AntDesign
            name="search1"
            size={24}
            color="#888"
            style={styles.searchIcon}
            onPress={() => navigation.navigate('RouteSearchScreen')}
          />
        </Pressable>

        <Pressable style={styles.dropdownButton} onPress={toggleDropdown}>
          <AntDesign name={dropdownVisible ? 'up' : 'down'} size={24} color="#1e1e1e" />
        </Pressable>
      </View>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          <Pressable style={styles.dropdownItem} onPress={() => selectOption('Option 1')}>
            <Ionicons name="bus-outline" size={24} color="#1e1e1e" />
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={() => selectOption('Option 2')}>
            <MaterialIcons name="gps-fixed" size={24} color="#1e1e1e" />
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={() => selectOption('Option 3')}>
            <FontAwesome5 name="traffic-light" size={24} color="#1e1e1e" />
          </Pressable>
        </View>
      )}

      {/* เพิ่มคอมโพเนนต์แผนที่ลงไปที่นี่ */}
      <MyMapComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 85,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 6,
    width: '75%',
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 1,
    elevation: 1.5,
    // เพิ่ม boxShadow สำหรับ Web
    boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.1)',
  },
  searchBar: {
    flex: 1,
    height: '100%',
    borderRadius: 12,
    paddingLeft: 10,
    fontSize: 16,
    fontFamily: 'Prompt-Regular', // ใช้ฟอนต์ที่โหลด
  },
  searchIcon: {
    marginRight: 10,
  },
  dropdownButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 6,
    marginLeft: 10,
    height: 52,
    width: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 1,
    elevation: 1.5,
    // เพิ่ม boxShadow สำหรับ Web
    boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.1)',
  },
  dropdown: {
    position: 'absolute',
    top: 95,
    right: '4.5%',
    width: 52,  // Set width to match dropdownButton
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 1,
    elevation: 1.5,
    zIndex: 1,
    marginTop: 70,
    // เพิ่ม boxShadow สำหรับ Web
    boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.1)',
  },
  dropdownItem: {
    width: 52,  // Match width of dropdownButton
    height: 52, // Match height of dropdownButton
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
