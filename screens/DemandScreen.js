import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  Animated,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import {
  MaterialIcons,
  FontAwesome5,
  AntDesign,
  Feather,
} from "@expo/vector-icons";
import { database, ref, onValue, update } from "../firebaseConfig";

const DemandScreen = () => {
  const [location, setLocation] = useState({
    latitude: 14.070074,
    longitude: 100.604836,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [busStops, setBusStops] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState(null);
  const [checkInMessage, setCheckInMessage] = useState("");
  const [showCheckInButton, setShowCheckInButton] = useState(false);
  const [userCheckedInStop, setUserCheckedInStop] = useState(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
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
    const R = 6371e3; // Radius of Earth in meters
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
      const currentCount = nearestStop.count || 0;
      update(ref(database, "PassengerCount"), {
        [nearestStop.title]: currentCount + 1,
      });

      setCheckInStatus(true);
      setUserCheckedInStop(nearestStop.title);
      setCheckInMessage(
        `You are at ${nearestStop.title}. ${currentCount + 1} passengers now`
      );
    } else {
      setCheckInStatus(false);
      setCheckInMessage("You are not within 100 meters of any bus stop");
    }
    setModalVisible(true);
  };

  const toggleSlide = () => {
    const toValue = showCheckInButton ? 0 : -60;
    Animated.timing(slideAnim, {
      toValue,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setShowCheckInButton(!showCheckInButton);
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (userCheckedInStop) {
        const checkedInStop = busStops.find((stop) => stop.title === userCheckedInStop);
        if (checkedInStop) {
          const distance = getDistance(
            location.latitude,
            location.longitude,
            checkedInStop.latitude,
            checkedInStop.longitude
          );

          if (distance > 100) {
            const currentCount = checkedInStop.count || 1;
            update(ref(database, "PassengerCount"), {
              [checkedInStop.title]: Math.max(currentCount - 1, 0),
            });

            setCheckInMessage(`You have checked out from ${checkedInStop.title}`);
            setModalVisible(true);
            setUserCheckedInStop(null);
          }
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [location, busStops, userCheckedInStop]);

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
        {busStops.map((stop, index) => {
          let markerColor = "green";
          if (stop.count >= 5 && stop.count <= 10) markerColor = "yellow";
          else if (stop.count > 10) markerColor = "red";

          return (
            <Marker
              key={`bus-${index}`}
              coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
              title={stop.title}
              description={`Check-ins: ${stop.count}`}
            >
              <View style={[styles.marker, { backgroundColor: markerColor }]}>
                <Text style={styles.markerText}>{stop.count}</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      <TouchableOpacity style={styles.gpsButton} onPress={getCurrentLocation}>
        <MaterialIcons name="gps-fixed" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.userButtonContainer}>
        <TouchableOpacity style={styles.userButton} onPress={toggleSlide}>
          {showCheckInButton ? (
            <AntDesign name="close" size={24} color="black" />
          ) : (
            <Feather name="user" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.checkInButtonContainer,
          {
            transform: [{ translateX: slideAnim }],
            zIndex: showCheckInButton ? 1 : 0,
          },
        ]}
        pointerEvents={showCheckInButton ? "auto" : "none"}
      >
        <TouchableOpacity
          style={styles.checkInButton}
          onPress={checkInAtBusStop}
        >
          <FontAwesome5 name="walking" size={24} color="black" />
          <Text>Check-In</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {checkInStatus ? (
              <FontAwesome5 name="check-circle" size={50} color="green" />
            ) : (
              <FontAwesome5 name="times-circle" size={50} color="red" />
            )}
            <Text style={styles.checkInMessage}>{checkInMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
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
    flex: 1,
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  markerText: {
    color: "white",
    fontWeight: "bold",
  },
  gpsButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userButtonContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  userButton: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkInButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 80,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkInButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  checkInMessage: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  modalButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DemandScreen;
