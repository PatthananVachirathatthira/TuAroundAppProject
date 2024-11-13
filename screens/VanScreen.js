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

const VanScreen = () => {
  const [location, setLocation] = useState({
    latitude: 14.070074,
    longitude: 100.604836,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [vanStops, setVanStops] = useState([]);
  const [busStops, setBusStops] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [ticketInfo, setTicketInfo] = useState(null);
  const mapRef = useRef(null);
  const [fontLoaded, setFontLoaded] = useState(false);

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
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setLocation(currentRegion);

    if (mapRef.current) {
      mapRef.current.animateToRegion(currentRegion, 1000);
    }
  };

  useEffect(() => {
    const vanRef = ref(database, "Van");
    onValue(vanRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const stops = [];
        Object.entries(data).forEach(([name, details]) => {
          if (typeof details === "object") {
            Object.entries(details).forEach(([key, value]) => {
              if (key.startsWith("ท่า")) {
                const coords = value || "";
                const [latitude, longitude] = coords.split(", ").map(Number);
                stops.push({ name: key, latitude, longitude });
              }
            });
          } else if (name.startsWith("ท่า")) {
            const coords = details || "";
            const [latitude, longitude] = coords.split(", ").map(Number);
            stops.push({ name, latitude, longitude });
          }
        });
        setVanStops(stops);
        setTicketInfo(data);
      }
    });

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
      Object.entries(ticketInfo).filter(([location]) => location !== "ท่ารถตู้")
    );

    return (
      <ScrollView
        contentContainerStyle={{ alignItems: "flex-start" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>สถานที่</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>รอบแรก</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>รอบสุดท้าย</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>ราคา</Text>
          </View>
          {Object.entries(filteredTicketInfo).map(([location, routes], index) =>
            Object.entries(routes).map(([route, details]) => {
              if (typeof details === "object") {
                return (
                  <View
                    key={`${location}-${route}`}
                    style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        const coords = routes["ท่า" + location] || "";
                        const [latitude, longitude] = coords.split(", ").map(Number);
                        handleLocationPress(latitude, longitude);
                      }}
                      style={{ flex: 1 }}
                    >
                      <Text style={styles.locationName}>{location}</Text>
                    </TouchableOpacity>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{details["รอบแรก"]}</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{details["รอบสุดท้าย"]}</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{details["ราคา"]} บาท</Text>
                  </View>
                );
              }
              return null;
            })
          )}
        </View>
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
        {busStops.map((stop, index) => (
          <Marker
            key={`bus-${index}`}
            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
          >
            <Image
              source={require('../assets/images/bus-stop.png')}
              style={{ width: 18, height: 18 }}
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
            {renderTicketInfo()}
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
    padding: 25,
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
  },
  tableHeaderText: {
    fontSize: 16,
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
    color: "#1e1e1e",
    textAlign: "center",
  },
  locationName: {
    fontSize: 14,
    fontFamily: "Prompt-Medium",
    textAlign: "center",
    color: "#1e1e1e",
  },
  closeButton: {
    backgroundColor: "#1e1e1e",
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
    fontSize: 18,
  },
});

export default VanScreen;
