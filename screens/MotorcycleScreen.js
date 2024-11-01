import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, Modal, Text, Pressable } from "react-native"; // Import Modal and Pressable
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
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [selectedStop, setSelectedStop] = useState(null); // State for the selected bus stop
  const [priceDetails, setPriceDetails] = useState(null); // State for price details
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
  }, []);

  // Function to fetch price details from Firebase
  const fetchPriceDetails = (locationId) => {
    const priceRef = ref(database, `priceData/${locationId}`); // Update the path as needed
    onValue(priceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPriceDetails(data); // Set price details from Firebase
      } else {
        setPriceDetails(null); // Clear details if no data is found
      }
    });
  };

  // Function to handle marker press
  const handleMarkerPress = (stop) => {
    setSelectedStop(stop);
    fetchPriceDetails(stop.title); // Fetch price details for the clicked stop
    setModalVisible(true); // Show the modal when a marker is pressed
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={location}
          showsUserLocation={true}
          showsMyLocationButton={true}
          zoomEnabled={true}
          scrollEnabled={true}
        >
          {/* Show EVStop markers */}
          {busStops.map((stop, index) => (
            <Marker
              key={`bus-${index}`}
              coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
              title={stop.title}
              onPress={() => handleMarkerPress(stop)} // Handle marker press
            >
              <Image
                source={require('../assets/images/bus-stop.png')}
                style={{ width: 18, height: 18 }}
                resizeMode="contain"
              />
            </Marker>
          ))}

          {/* Show bike location markers */}
          {bikeLocations.map((location, index) => (
            <Marker
              key={`bike-${index}`}
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title={location.title}
              onPress={() => handleMarkerPress(location)} // Handle marker press
            >
              <Image
                source={require('../assets/images/taxi-motorcycle.jpg')}
                style={{ width: 18, height: 18 }}
                resizeMode="contain"
              />
            </Marker>
          ))}
        </MapView>
      ) : null}

      {/* Current location button */}
      <TouchableOpacity style={styles.customButton} onPress={getCurrentLocation}>
        <MaterialIcons name="gps-fixed" size={24} color="black" />
      </TouchableOpacity>

      {/* Modal for showing bus stop details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{selectedStop ? selectedStop.title : ''}</Text>
          {priceDetails && (
            <>
              <Text>สถานที่: {priceDetails.location}</Text>
              <Text>ราคา: {priceDetails.price} บาท</Text>
            </>
          )}
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.textStyle}>Close</Text>
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
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default MotorcycleScreen;
