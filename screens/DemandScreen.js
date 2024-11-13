import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  Modal,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { database, ref, onValue } from "../firebaseConfig"; // นำเข้า Firebase

const DemandScreen = () => {
  const [location, setLocation] = useState({
    latitude: 14.070074,
    longitude: 100.604836,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [busStops, setBusStops] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState(null); // true = success, false = fail
  const [checkInMessage, setCheckInMessage] = useState("");
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
    const passengerCountRef = ref(database, "PassengerCount");

    onValue(busStopsRef, (snapshot) => {
      const busStopData = snapshot.val();
      if (busStopData) {
        const busStopsList = Object.keys(busStopData)
          .map((key) => {
            const coords = busStopData[key]
              .split(", ")
              .map((coord) => parseFloat(coord));
            return coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])
              ? { latitude: coords[0], longitude: coords[1], title: key }
              : null;
          })
          .filter((stop) => stop !== null);

        onValue(passengerCountRef, (countSnapshot) => {
          const countData = countSnapshot.val();
          const updatedBusStops = busStopsList.map((stop) => {
            const count = countData[stop.title] || 0;
            return { ...stop, count };
          });
          setBusStops(updatedBusStops);
        });
      }
    });
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const checkInAtBusStop = () => {
    let nearestStop = null;
    let minDistance = Infinity;

    busStops.forEach((stop) => {
      const distance = getDistance(
        location.latitude,
        location.longitude,
        stop.latitude,
        stop.longitude
      );
      if (distance <= 100 && distance < minDistance) {
        minDistance = distance;
        nearestStop = stop;
      }
    });

    if (nearestStop) {
      setCheckInStatus(true);
      setCheckInMessage(
        `You are at ${nearestStop.title}. ${
          nearestStop.count + 1
        } passengers now`
      );
    } else {
      setCheckInStatus(false);
      setCheckInMessage("You are not within 50 meters of any bus stop");
    }
    setModalVisible(true);
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
        {busStops.map((stop, index) => (
          <Marker
            key={`bus-${index}`}
            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
            title={stop.title}
            description={`Check-ins: ${stop.count}`}
          >
            <Image
              source={require("../assets/images/bus-stop.png")}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
            />
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity style={styles.gpsButton} onPress={getCurrentLocation}>
        <MaterialIcons name="gps-fixed" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.checkInButton} onPress={checkInAtBusStop}>
        <Text style={styles.checkInText}>Check In</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.iconContainer}>
              <View
                style={[
                  styles.iconBackground,
                  { backgroundColor: checkInStatus ? "#4CAF50" : "#FF3B30" },
                ]}
              >
                <MaterialIcons
                  name={checkInStatus ? "check" : "close"}
                  size={40}
                  color="white"
                />
              </View>
            </View>
            <Text style={styles.modalTitle}>
              {checkInStatus ? "Check-In Successful" : "No Nearby Stop"}
            </Text>
            <Text style={styles.modalMessage}>{checkInMessage}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
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
  gpsButton: {
    position: "absolute",
    bottom: 35,
    right: 30,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  checkInButton: {
    position: "absolute",
    bottom: 90,
    right: 30,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 5,
  },
  checkInText: {
    color: "#1e1e1e",
    fontSize: 16,
    fontFamily: "Prompt-Medium",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "75%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 15,
  },
  iconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50", // สีเขียวแบบในภาพ
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: "Prompt-Medium",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
    fontFamily: "Prompt-Regular",
    color: "#575757",
  },
  closeButton: {
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Prompt-Medium",
  },
});

export default DemandScreen;
