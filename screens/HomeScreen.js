import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Pressable, StyleSheet, ActivityIndicator, Alert, Modal, Text, Animated, ScrollView } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as Location from 'expo-location';
import MyMapComponent from '../components/MyMapComponent';
import { getDatabase, ref, get } from 'firebase/database';



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

  const handleBusRouteSelection = async (route) => {
  const db = getDatabase();
  let routeKey;
  switch (route) {
  case 'Route 1':
    routeKey = '1A-สีแดง'; // ต้องตรงกับคีย์ใน routeColors
    break;
  case 'Route 2':
    routeKey = '1B-สีเหลือง';
    break;
  case 'Route 3':
    routeKey = '2-สีเขียว';
    break;
  case 'Route 4':
    routeKey = '3-ม่วง';
    break;
  case 'Route 5':
    routeKey = '5-ฟ้า';
    break;
  default:
    routeKey = null;
}


  if (routeKey) {
    const routeRef = ref(db, `EVroute/${routeKey}`);
    const snapshot = await get(routeRef);
    if (snapshot.exists()) {
      const routeData = snapshot.val();

      // สร้าง array ของสถานีและลำดับ
      let stationsWithOrder = [];

      Object.entries(routeData).forEach(([stationName, order]) => {
        if (typeof order === 'string') {
          // กรณีที่มีหลายลำดับ เช่น "24, 27"
          order.split(', ').forEach(singleOrder => {
            stationsWithOrder.push({ name: stationName, order: parseInt(singleOrder) });
          });
        } else {
          // กรณีที่มีลำดับเดียว
          stationsWithOrder.push({ name: stationName, order: order });
        }
      });

      // เรียงตามลำดับที่จากน้อยไปหามาก
      stationsWithOrder.sort((a, b) => a.order - b.order);

      // สร้าง array ของชื่อสถานีที่เรียงแล้ว
      const stations = stationsWithOrder.map(station => station.name);

      setRouteStations(stations); // กำหนดค่าสถานีจาก Firebase
      setSelectedBusRoute(routeKey);
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0, // เลื่อน modal ขึ้น
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      console.log('No data available for this route.');
    }
  }
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
      <Text style={styles.modalTitle}>สถานี:</Text>
      <ScrollView contentContainerStyle={styles.stationList}>
        {routeStations.map((station, index) => (
          <Text key={index} style={styles.stationText}>{`${index + 1}. ${station}`}</Text>
        ))}
      </ScrollView>
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
    height: '40%', // ปรับขนาดของ modal
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10, // ให้เงาดูสวย
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    padding: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Prompt-Bold',
    marginBottom: 10,
    color: '#333',
  },
  stationList: {
    alignItems: 'flex-start',
    paddingBottom: 20,
  },
  stationText: {
    fontSize: 16,
    fontFamily: 'Prompt-Regular',
    color: '#555',
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#eaeaea',
    borderRadius: 10,
    width: '100%', // ให้ข้อความอยู่ในกรอบ
  },
  closeButton: {
    fontSize: 18,
    fontFamily: 'Prompt-Medium',
    color: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default HomeScreen;
