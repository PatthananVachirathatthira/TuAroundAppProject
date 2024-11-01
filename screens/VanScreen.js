import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
  Image, // Import Image component

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
  const [busStops, setBusStops] = useState([]); // Add state for bus stops
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
    // Fetch van stops
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

    // Fetch bus stops
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
        setBusStops(stops); // Set busStops
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
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false} // ปิดเส้นเลื่อนแนวนอน
      >
        <Text style={styles.title}>ข้อมูลการโดยสาร</Text>
        {Object.entries(filteredTicketInfo).map(([location, routes]) => (
          <View key={location} style={styles.infoContainer}>
            <TouchableOpacity
              onPress={() => {
                const coords = routes["ท่า" + location] || "";
                const [latitude, longitude] = coords.split(", ").map(Number);
                handleLocationPress(latitude, longitude);
              }}
            >
              <Text style={styles.locationName}>{location}</Text>
            </TouchableOpacity>
            {Object.entries(routes).map(([route, details]) => {
              if (typeof details === "object") {
                return (
                  <Text key={route}>
                    <Text style={styles.routeName}>{route}</Text>
                    {"\n"} {/* เพิ่มบรรทัดใหม่ */}
                    รอบแรก:{" "}
                    <Text style={styles.routeValue}>{details["รอบแรก"]}</Text>
                    {"\n"} {/* เพิ่มบรรทัดใหม่ */}
                    รอบสุดท้าย:{" "}
                    <Text style={styles.routeValue}>
                      {details["รอบสุดท้าย"]}
                    </Text>
                    {"\n"} {/* เพิ่มบรรทัดใหม่ */}
                    ราคา:{" "}
                    <Text style={styles.routeValue}>{details["ราคา"]} บาท</Text>
                    {"\n\n"} {/* เพิ่มบรรทัดว่างระหว่างรายการ */}
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
        
        {/* Display bus stops */}
        {busStops.map((stop, index) => (
          <Marker
            key={`bus-${index}`}
            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
          >
            <Image
              source={require('../assets/images/bus-stop.png')} // Your bus stop image path
              style={{ width: 18, height: 18 }} // Adjust the size as needed
              resizeMode="contain"
            />
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity
        style={styles.customButton}
        onPress={getCurrentLocation}
      >
        <MaterialIcons name="gps-fixed" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => setModalVisible(true)}
      >
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
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};;

const styles = StyleSheet.create({
  routeName: {
    fontSize: 14,
    fontFamily: 'Prompt-Regular',
  },
  routeValue: {
    color: '#000',
    fontFamily: 'Prompt-Regular',
  },
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
    bottom: 140, // ระยะห่างจากปุ่ม gps-fixed
    right: 30,
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
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
    alignItems: "center", // ศูนย์กลางในแนวนอน
    justifyContent: "center", // ศูนย์กลางในแนวตั้ง
    position: "relative",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: "Prompt-Bold",
  },
  infoContainer: {
    marginBottom: 10, // ลด margin ด้านล่าง
    paddingVertical: 5, // เพิ่ม padding แนวตั้ง
    paddingHorizontal: 5, // ลด padding ซ้าย-ขวา
  },
  locationName: {
    fontSize: 18,
    fontFamily: "Prompt-Medium",
    alignSelf: 'flex-start', // ชิดซ้าย
  },
  closeButton: {
    position: "absolute", // ใช้ absolute เพื่อให้วางปุ่มได้อิสระ
    top: 14,
    right: 15,
    backgroundColor: "black",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  closeButtonText: {
    color: "white",
    fontFamily: "Prompt-Regular",
  },
  routeText: {
    fontSize: 14,
    fontFamily: "Prompt-Regular",
  },
});

export default VanScreen;
