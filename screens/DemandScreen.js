import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, Text, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";
import { database, ref, onValue, update } from "../firebaseConfig";

const DemandScreen = () => {
  const [location, setLocation] = useState({
    latitude: 14.070074,
    longitude: 100.604836,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [busStops, setBusStops] = useState([]);
  const [checkedInStop, setCheckedInStop] = useState(null); // Track the current check-in
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

  useEffect(() => {
  let locationSubscription;

  const startLocationUpdates = async () => {
    locationSubscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 10 },
      (newLocation) => {
        setLocation({
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        // ตรวจสอบว่าผู้ใช้ได้ออกจากระยะ 100 เมตรจากจุดที่ check-in ไว้หรือไม่
        if (checkedInStop) {
          const distance = getDistance(
            newLocation.coords.latitude,
            newLocation.coords.longitude,
            checkedInStop.latitude,
            checkedInStop.longitude
          );

          if (distance > 100) {
            resetPassengerCount(checkedInStop.title);
            setCheckedInStop(null); // ลบสถานะการ check-in
          }
        }
      }
    );
  };

  startLocationUpdates();

  // ฟังก์ชัน cleanup เพื่อลบ location watcher
  return () => {
    if (locationSubscription) {
      locationSubscription.remove();
    }
  };
}, [checkedInStop]);


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
      const passengerCountRef = ref(database, "PassengerCount/" + nearestStop.title);

      onValue(passengerCountRef, (snapshot) => {
        const currentCount = snapshot.val() || 0;
        const newCount = currentCount + 1;

        update(passengerCountRef, {
          [nearestStop.title]: newCount,
        })
          .then(() => {
            Alert.alert("Check-In Successful", `You are at ${nearestStop.title}. ${newCount} passengers now.`);
            setCheckedInStop(nearestStop); // Set the checked-in stop
          })
          .catch((error) => {
            console.error("Error updating passenger count:", error);
            Alert.alert("Error", "Failed to update the check-in count.");
          });
      });
    } else {
      Alert.alert("No Nearby Stop", "You are not within 100 meters of any bus stop.");
    }
  };

  const resetPassengerCount = (stopTitle) => {
    const passengerCountRef = ref(database, "PassengerCount/" + stopTitle);
    update(passengerCountRef, { [stopTitle]: 0 })
      .then(() => {
        console.log(`Passenger count reset to 0 for ${stopTitle}`);
      })
      .catch((error) => {
        console.error("Error resetting passenger count:", error);
      });
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
