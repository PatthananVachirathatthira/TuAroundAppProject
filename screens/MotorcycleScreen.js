import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, Modal, Text, Pressable, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { database, ref, onValue } from "../firebaseConfig";

const MotorcycleScreen = () => {
  const [location, setLocation] = useState({
    latitude: 14.070074,
    longitude: 100.604836,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [bikeLocations, setBikeLocations] = useState([]);
  const [busStops, setBusStops] = useState([]);
  const [feeData, setFeeData] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false);
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
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    };
    setLocation(currentRegion);

    if (mapRef.current) {
      mapRef.current.animateToRegion(currentRegion, 1000);
    }
  };

  useEffect(() => {
    const busStopsRef = ref(database, "EVstop");
    onValue(busStopsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const stops = Object.keys(data)
          .map((key) => {
            const coords = data[key].split(", ").map((coord) => parseFloat(coord));
            return coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])
              ? { latitude: coords[0], longitude: coords[1], title: key }
              : null;
          })
          .filter((stop) => stop !== null);
        setBusStops(stops);
      }
    });

    const bikeLocationRef = ref(database, "BikeLocation");
    onValue(bikeLocationRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const locations = Object.keys(data)
          .map((key) => {
            const coords = data[key].split(", ").map((coord) => parseFloat(coord));
            return coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])
              ? { latitude: coords[0], longitude: coords[1], title: key }
              : null;
          })
          .filter((location) => location !== null);
        setBikeLocations(locations);
      }
    });

    const feeRef = ref(database, "fee");
    onValue(feeRef, (snapshot) => {
      const data = snapshot.val();
      setFeeData(data);
    });
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={location}
          showsUserLocation={true}
          showsMyLocationButton={false}
          zoomEnabled={true}
          scrollEnabled={true}
        >
          {busStops.map((stop, index) => (
            <Marker
              key={`bus-${index}`}
              coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
              title={stop.title}
            >
              <Image
                source={require('../assets/images/bus-stop.png')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </Marker>
          ))}
          
          {bikeLocations.map((location, index) => (
            <Marker
              key={`bike-${index}`}
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title={location.title}
            >
              <Image
                source={require('../assets/images/taxi-motorcycle.jpg')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </Marker>
          ))}
        </MapView>
      ) : null}

      <TouchableOpacity style={styles.customButton} onPress={getCurrentLocation}>
        <MaterialIcons name="gps-fixed" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.openModalButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>info</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={styles.modalTitle}>รายละเอียด</Text>
            {feeData ? (
              Object.keys(feeData).map((origin) => (
                <View key={origin}>
                  <Text style={styles.originText}>ต้นทาง: {origin}</Text>
                  {Object.keys(feeData[origin]).map((destination) => (
                    <View key={destination} style={styles.destinationContainer}>
                      <Text style={styles.destinationText}>{destination}</Text>
                      {Object.keys(feeData[origin][destination]).map((stop) => (
                        <Text key={stop} style={styles.feeText}>
                          {stop}: {feeData[origin][destination][stop]} บาท
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <Text>Loading...</Text>
            )}
          </ScrollView>
          <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
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
    bottom: 35,
    right: 30,
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 50,
    elevation: 6,
  },
  openModalButton: {
    position: "absolute",
    bottom: 35,
    left: 30,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 50,
    elevation: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    color: "#333",
  },
  originText: {
    fontSize: 18,
    fontWeight: '500',
    marginVertical: 8,
  },
  destinationContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  destinationText: {
    fontSize: 16,
    color: "#555",
    marginVertical: 2,
  },
  feeText: {
    fontSize: 14,
    color: "#888",
  },
  closeButton: {
    alignSelf: "center",
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 15,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default MotorcycleScreen;
