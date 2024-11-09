import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, Text, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { database, ref, onValue, update } from "../firebaseConfig"; // import update function

const DemandScreen = () => {
  const [location, setLocation] = useState({
    latitude: 14.070074,
    longitude: 100.604836,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [busStops, setBusStops] = useState([]);
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

  // Fetch bus stops data and passenger count
  useEffect(() => {
    const busStopsRef = ref(database, "EVstop");
    const passengerCountRef = ref(database, "PassengerCount");

    // Fetch bus stop coordinates and passenger counts
    onValue(busStopsRef, (snapshot) => {
      const busStopData = snapshot.val();
      if (busStopData) {
        const busStopsList = Object.keys(busStopData).map((key) => {
          const coords = busStopData[key].split(", ").map((coord) => parseFloat(coord));
          return coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])
            ? { latitude: coords[0], longitude: coords[1], title: key }
            : null;
        }).filter(stop => stop !== null);

        // Fetch passenger counts for each bus stop
        onValue(passengerCountRef, (countSnapshot) => {
          const countData = countSnapshot.val();
          const updatedBusStops = busStopsList.map((stop) => {
            const count = countData[stop.title] || 0; // Default to 0 if no count found
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

  // Inside your check-in function
const checkInAtBusStop = () => {
  let nearestStop = null;
  let minDistance = Infinity;

  // Find the nearest bus stop
  busStops.forEach((stop) => {
    const distance = getDistance(
      location.latitude,
      location.longitude,
      stop.latitude,
      stop.longitude
    );
    if (distance <= 100 && distance < minDistance) { // Update to 50 meters
      minDistance = distance;
      nearestStop = stop;
    }
  });

  if (nearestStop) {
    // Update PassengerCount in Firebase
    const passengerCountRef = ref(database, "PassengerCount/" + nearestStop.title);

    onValue(passengerCountRef, (snapshot) => {
      const currentCount = snapshot.val() || 0; // Default to 0 if no count found
      const newCount = currentCount + 1; // Increment the count

      // Correct way to update the count in Firebase to ensure the value is a number
      update(passengerCountRef, {
        [nearestStop.title]: newCount, // Pass only the new count as a number
      })
        .then(() => {
          Alert.alert("Check-In Successful", `You are at ${nearestStop.title}. ${newCount} passengers now.`);
        })
        .catch((error) => {
          console.error("Error updating passenger count:", error);
          Alert.alert("Error", "Failed to update the check-in count.");
        });
    });
  } else {
    Alert.alert("No Nearby Stop", "You are not within 50 meters of any bus stop.");
  }
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
            description={`Check-ins: ${stop.count}`} // Display check-in count
          >
            <Image
              source={require('../assets/images/bus-stop.png')}
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
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 5,
  },
  checkInText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DemandScreen;
