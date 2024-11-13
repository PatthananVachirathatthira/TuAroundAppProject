import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as Font from "expo-font";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { database, ref, onValue } from "../firebaseConfig";

const MotorcycleScreen = () => {
  const [location, setLocation] = useState({
    latitude: 14.070074,
    longitude: 100.604836,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [bikeLocations, setBikeLocations] = useState([]);
  const [feeData, setFeeData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const mapRef = useRef(null);

  const fetchFonts = () => {
    return Font.loadAsync({
      "Prompt-Regular": require("../assets/fonts/Prompt-Regular.ttf"),
      "Prompt-Bold": require("../assets/fonts/Prompt-Bold.ttf"),
      "Prompt-Medium": require("../assets/fonts/Prompt-Medium.ttf"),
    });
  };

  useEffect(() => {
    fetchFonts().then(() => setFontLoaded(true));
  }, []);

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

    const feeRef = ref(database, "BikeFee");
    onValue(feeRef, (snapshot) => {
      const data = snapshot.val();
      setFeeData(data);
    });
  }, []);

  const renderFeeInfo = () => {
    if (!feeData) return <Text>Loading...</Text>;

    return (
      <ScrollView
        contentContainerStyle={{ alignItems: "flex-start" }}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(feeData).map(([origin, destinations], index) =>
          Object.entries(destinations).map(([destination, fee]) => (
            fee > 0 && (
              <View key={`${origin}-${destination}-${index}`} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}>
                <Text style={[styles.tableCell, { flex: 1 }]}>{origin}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{destination}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{fee}</Text>
              </View>
            )
          ))
        )}
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

      <TouchableOpacity style={styles.customButton} onPress={getCurrentLocation}>
        <MaterialIcons name="gps-fixed" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.detailsButton} onPress={() => setModalVisible(true)}>
        <AntDesign name="infocirlceo" size={24} color="black" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>ต้นทาง</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>ปลายทาง</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>ค่าบริการ (บาท)</Text>
            </View>
            {renderFeeInfo()}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>ปิด</Text>
          </TouchableOpacity>
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
    bottom: 70,
    right: 30,
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  detailsButton: {
    position: "absolute",
    bottom: 140,
    right: 30,
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 15,
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderRadius: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    paddingVertical: 15,
    position: "relative",
    zIndex: 1,
  },
  tableHeaderText: {
    fontSize: 15,
    fontFamily: "Prompt-Medium",
    color: "white",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 10,
  },
  tableRowAlternate: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 10,
  },
  tableCell: {
    fontSize: 14,
    fontFamily: "Prompt-Regular",
    color: '#1e1e1e',
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: '#1e1e1e',
    width: 90,
    alignSelf: "center",
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "white",
    fontFamily: "Prompt-Medium",
    fontSize: 16,
  },
});

export default MotorcycleScreen;
