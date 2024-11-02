import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { database, ref, onValue } from '../firebaseConfig';

const RouteScreen = ({ route }) => {
  const [isModalVisible, setModalVisible] = useState(true); // เปิด Modal โดยเริ่มต้น
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [routes, setRoutes] = useState([]); // เพิ่ม state สำหรับสาย
  const mapRef = useRef(null);

  const { start, end } = route.params;

  useEffect(() => {
    const evStopRef = ref(database, "EVstop");
    const evRouteRef = ref(database, "EVroute"); // ดึงข้อมูลเส้นทาง

    // ดึงข้อมูลสถานี
    onValue(evStopRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const startCoords = data[start].split(", ").map((coord) => parseFloat(coord));
        const endCoords = data[end].split(", ").map((coord) => parseFloat(coord));

        setStartLocation({
          title: start,
          coords: startCoords,
        });
        setEndLocation({
          title: end,
          coords: endCoords,
        });

        // Animate ไปยังสถานีต้นทางที่เลือก
        mapRef.current.animateToRegion({
          latitude: startCoords[0],
          longitude: startCoords[1],
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    });

    // ดึงข้อมูลสายที่ต้องใช้
    onValue(evRouteRef, (snapshot) => {
      const routeData = snapshot.val();
      const availableRoutes = [];

      // ตรวจสอบสายที่เหมาะสม
      for (const routeName in routeData) {
        const stations = routeData[routeName];
        const startValue = stations[start];
        const endValue = stations[end];

        if (startValue < endValue) {
          availableRoutes.push(routeName);
        }
      }

      setRoutes(availableRoutes); // เก็บสายที่ได้จากการตรวจสอบ
    });
  }, [start, end]);

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 14.07007,
          longitude: 100.604836,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {startLocation && (
          <Marker
            coordinate={{
              latitude: startLocation.coords[0],
              longitude: startLocation.coords[1],
            }}
            title={startLocation.title}
          />
        )}
        {endLocation && (
          <Marker
            coordinate={{
              latitude: endLocation.coords[0],
              longitude: endLocation.coords[1],
            }}
            title={endLocation.title}
          />
        )}
      </MapView>
      
      {isModalVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>รายละเอียดเส้นทาง</Text>
            <ScrollView style={styles.stationScrollView}>
              <View style={styles.stationList}>
                <Text style={styles.routeInfo}>{`จาก: ${start}`}</Text>
                <Text style={styles.routeInfo}>{`ถึง: ${end}`}</Text>
                {/* แสดงข้อมูลสายที่ต้องขึ้น */}
                {routes.length > 0 ? (
                  routes.map((routeName, index) => (
                    <Text key={index} style={styles.stationText}>{routeName}</Text>
                  ))
                ) : (
                  <Text style={styles.stationText}>ไม่มีสายที่เหมาะสม</Text>
                )}
              </View>
            </ScrollView>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>ปิด</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  map: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Prompt-Bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  routeInfo: {
    marginBottom: 15,
  },
  stationScrollView: {
    flex: 1,
    marginVertical: 10,
  },
  stationList: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingBottom: 20,
  },
  stationText: {
    fontSize: 16,
    fontFamily: 'Prompt-Regular',
    color: '#555',
    padding: 10,
    backgroundColor: '#eaeaea',
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
  },
  closeButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginTop: 15,
  },
  closeButtonText: {
    fontSize: 18,
    fontFamily: 'Prompt-Medium',
    color: '#007AFF',
  },
});

export default RouteScreen;
