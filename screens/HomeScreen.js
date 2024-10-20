import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert, Modal, Text, Animated } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as Location from 'expo-location';
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
  const [location, setLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [routeStations, setRouteStations] = useState([]); // ประกาศสถานี
  const slideAnim = useRef(new Animated.Value(300)).current; // เริ่มต้นที่ 300

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

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 10000,
        timeout: 5000,
      });

      console.log('Location:', currentLocation);
      setLocation(currentLocation);
    })();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleBusRouteSelection = (route) => {
    let stations = [];
    switch (route) {
      case 'Route 1':
        setSelectedBusRoute('1A');
        stations = ['Station 1', 'Station 2', 'Station 3'];
        break;
      case 'Route 2':
        setSelectedBusRoute('1B');
        stations = ['Station 4', 'Station 5', 'Station 6'];
        break;
      case 'Route 3':
        setSelectedBusRoute('2');
        stations = ['Station 7', 'Station 8', 'Station 9'];
        break;
      case 'Route 4':
        setSelectedBusRoute('3');
        stations = ['Station 10', 'Station 11', 'Station 12'];
        break;
      case 'Route 5':
        setSelectedBusRoute('5');
        stations = ['Station 13', 'Station 14', 'Station 15'];
        break;
      default:
        setSelectedBusRoute(null);
    }
    setRouteStations(stations); // กำหนดค่าสถานี
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0, // เลื่อนขึ้น
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300, // กลับไปที่ 300
      duration: 500,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  if (!fontLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleResetLocation = () => {
    setDropdownVisible(false);
    if (location) {
      console.log('Current Location:', location);
    } else {
      Alert.alert('Location not available', 'Cannot reset location. Location data is not available.');
    }
  };

  const handleToggleTraffic = () => {
    setShowTraffic(!showTraffic);
    setDropdownVisible(false);
  };

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
            <Ionicons name="bus-outline" size={24} color="yellow" />
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={() => handleBusRouteSelection('Route 3')}>
            <Ionicons name="bus-outline" size={24} color="green" />
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={() => handleBusRouteSelection('Route 4')}>
            <Ionicons name="bus-outline" size={24} color="purple" />
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={() => handleBusRouteSelection('Route 5')}>
            <Ionicons name="bus-outline" size={24} color="blue" />
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
        userLocation={location}
      />
      
      {modalVisible && (
        <Animated.View
          style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.modalBackground}>
            <Text>สถานี:</Text>
            {routeStations.map((station, index) => (
              <Text key={index}>{station}</Text> // แสดงชื่อสถานี
            ))}
            <Pressable onPress={handleCloseModal}>
              <Text style={styles.closeButton}>ปิด</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
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
  },
  dropdown: {
    position: 'absolute',
    top: 70, // Adjust this as needed for positioning
    right: '5%',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1.5,
    zIndex: 1,
},
dropdownItem: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
},
dropdownText: {
    fontFamily: 'Prompt-Regular',
    color: '#1e1e1e',
},
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '33%', // ปรับความสูงของ modal ตามที่คุณต้องการ
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    padding: 20,
  },
  modalBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  closeButton: {
    color: '#007BFF',
    marginTop: 20,
  },
});

export default HomeScreen;
