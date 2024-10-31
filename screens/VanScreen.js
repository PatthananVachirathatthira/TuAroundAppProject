import React, { useEffect, useState, useRef } from "react"; 
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, Modal, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { database, ref, onValue } from '../firebaseConfig';

const VanScreen = () => {
  const [location, setLocation] = useState({
    latitude: 14.070074,
    longitude: 100.604836,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [vanStops, setVanStops] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [ticketInfo, setTicketInfo] = useState(null);
  const mapRef = useRef(null);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    const currentRegion = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setLocation(currentRegion);

    if (mapRef.current) {
      mapRef.current.animateToRegion(currentRegion, 1000);
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(location, 1000);
    }

    const vanRef = ref(database, 'Van');
    onValue(vanRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const stops = [];
        Object.entries(data).forEach(([name, details]) => {
          if (typeof details === 'object') {
            Object.entries(details).forEach(([key, value]) => {
              if (key.startsWith("ท่า")) {
                const coords = value || '';
                const [latitude, longitude] = coords.split(', ').map(Number);
                stops.push({ name: key, latitude, longitude });
              }
            });
          } else if (name.startsWith("ท่า")) {
            const coords = details || '';
            const [latitude, longitude] = coords.split(', ').map(Number);
            stops.push({ name, latitude, longitude });
          }
        });
        setVanStops(stops);
        setTicketInfo(data);
      }
    });
  }, []);

  const handleLocationPress = (latitude, longitude) => {
    const region = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    if (mapRef.current) {
      mapRef.current.animateToRegion(region, 1000);
    }
  };

  const renderTicketInfo = () => {
    if (!ticketInfo) return null;

    const filteredTicketInfo = Object.fromEntries(
      Object.entries(ticketInfo).filter(([location]) => 
        location !== "ท่ารถตู้"
      )
    );

    return (
      <ScrollView>
        <Text style={styles.title}>ข้อมูลการโดยสาร</Text>
        {Object.entries(filteredTicketInfo).map(([location, routes]) => (
          <View key={location} style={styles.infoContainer}>
            <TouchableOpacity onPress={() => {
              const coords = routes["ท่า" + location] || "";
              const [latitude, longitude] = coords.split(', ').map(Number);
              handleLocationPress(latitude, longitude);
            }}>
              <Text style={styles.locationName}>{location}</Text>
            </TouchableOpacity>
            {Object.entries(routes).map(([route, details]) => {
              if (typeof details === 'object') {
                return (
                  <Text key={route}>
                    {route}: รอบแรก {details["รอบแรก"]}, รอบสุดท้าย {details["รอบสุดท้าย"]}, ราคา {details["ราคา"]} บาท
                  </Text>
                );
              }
              return null;
            })}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={location}
        showsUserLocation={true}
        showsMyLocationButton={false}
        zoomEnabled={true}
        scrollEnabled={true}
      >
        {vanStops.map((stop, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
            title={stop.name}
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.customButton} onPress={getCurrentLocation}>
        <MaterialIcons name="gps-fixed" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.detailsButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.detailsButtonText}>รายละเอียด</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {renderTicketInfo()}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>ปิด</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  customButton: {
    position: "absolute",
    bottom: 80,
    right: 30,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  detailsButton: {
    position: "absolute",
    bottom: 35,
    left: 30,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  detailsButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoContainer: {
    marginBottom: 15,
  },
  locationName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default VanScreen;
