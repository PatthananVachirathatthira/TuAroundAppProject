import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

const MotorcycleScreen = () => {
  const [location, setLocation] = useState(null);
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
      latitudeDelta: 0.001,  // ขยายขอบเขตของการซูมออก
      longitudeDelta: 0.001, // ขยายขอบเขตของการซูมออก
    };
    setLocation(currentRegion);

    if (mapRef.current) {
      mapRef.current.animateToRegion(currentRegion, 1000);
    }
  };

  useEffect(() => {
    getCurrentLocation();
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
          zoomEnabled={true} // เปิดใช้งานการซูม
          scrollEnabled={true} // เปิดใช้งานการเลื่อนแผนที่
        />
      ) : null}

      <TouchableOpacity style={styles.customButton} onPress={getCurrentLocation}>
        <MaterialIcons name="gps-fixed" size={24} color="black" />
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
  customButton: {
    position: "absolute",
    bottom: 35,
    right: 30,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
});

export default MotorcycleScreen;
