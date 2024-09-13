import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as Location from 'expo-location'; // นำเข้า expo-location
import MyMapComponent from '../components/MyMapComponent';

const fetchFonts = () => {
  return Font.loadAsync({
    'Prompt-Regular': require('../assets/fonts/Prompt-Regular.ttf'),
    'Prompt-Bold': require('../assets/fonts/Prompt-Bold.ttf'),
    'Prompt-Medium': require('../assets/fonts/Prompt-Medium.ttf'),
  });
};

const HomeScreen = ({ navigation }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedBusRoute, setSelectedBusRoute] = useState(null);
  const [showTraffic, setShowTraffic] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [location, setLocation] = useState(null); // สถานะสำหรับตำแหน่งที่ตั้งของผู้ใช้

  useEffect(() => {
    fetchFonts().then(() => setFontLoaded(true));
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleBusRouteSelection = (route) => {
    setSelectedBusRoute(route);
    setDropdownVisible(false);
  };

  const handleResetLocation = () => {
    setDropdownVisible(false);
    // ฟังก์ชันรีเซ็ตตำแหน่งผู้ใช้
    if (location) {
      console.log('Current Location:', location);
      // คุณสามารถส่งตำแหน่งนี้ไปยังแผนที่เพื่อรีเซ็ตตำแหน่งที่แสดงได้
    } else {
      Alert.alert('Location not available', 'Cannot reset location. Location data is not available.');
    }
  };

  const handleToggleTraffic = () => {
    setShowTraffic(!showTraffic);
    setDropdownVisible(false);
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
          />
        </Pressable>

        <Pressable style={styles.dropdownButton} onPress={toggleDropdown}>
          <AntDesign name={dropdownVisible ? 'up' : 'down'} size={24} color="#1e1e1e" />
        </Pressable>
      </View>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          <Pressable style={styles.dropdownItem} onPress={() => handleBusRouteSelection('Route 1')}>
            <Ionicons name="bus-outline" size={24} color="red" />
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={() => handleBusRouteSelection('Route 2')}>
            <Ionicons name="bus-outline" size={24} color="blue" />
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={() => handleBusRouteSelection('Route 3')}>
            <Ionicons name="bus-outline" size={24} color="green" />
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={() => handleBusRouteSelection('Route 4')}>
            <Ionicons name="bus-outline" size={24} color="yellow" />
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={() => handleBusRouteSelection('Route 5')}>
            <Ionicons name="bus-outline" size={24} color="purple" />
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={handleResetLocation}>
            <MaterialIcons name="gps-fixed" size={24} color="#1e1e1e" />
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={handleToggleTraffic}>
            <FontAwesome5 name="traffic-light" size={24} color="#1e1e1e" />
          </Pressable>
        </View>
      )}

      <MyMapComponent
        selectedBusRoute={selectedBusRoute}
        showTraffic={showTraffic}
        userLocation={location} // ส่งข้อมูลตำแหน่งผู้ใช้ไปยัง MyMapComponent
      />
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
    boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.1)',
  },
  searchBar: {
    flex: 1,
    height: '100%',
    borderRadius: 12,
    paddingLeft: 10,
    fontSize: 16,
    fontFamily: 'Prompt-Regular',
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
    boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.1)',
  },
  dropdown: {
    position: 'absolute',
    top: 95,
    right: '4.5%',
    width: 52,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 1,
    elevation: 1.5,
    zIndex: 1,
    marginTop: 70,
    boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.1)',
  },
  dropdownItem: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;

//test branch
