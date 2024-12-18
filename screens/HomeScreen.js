import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  Animated,
  ScrollView,
  PanResponder,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import * as Font from "expo-font";
import * as Location from "expo-location";
import MyMapComponent from "../components/MyMapComponent";
import { getDatabase, ref, get } from "firebase/database";

const fetchFonts = () => {
  return Font.loadAsync({
    "Prompt-Regular": require("../assets/fonts/Prompt-Regular.ttf"),
    "Prompt-Bold": require("../assets/fonts/Prompt-Bold.ttf"),
    "Prompt-Medium": require("../assets/fonts/Prompt-Medium.ttf"),
  });
};

const HomeScreen = ({ navigation }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedBusRoute, setSelectedBusRoute] = useState(null);
  const [showTraffic, setShowTraffic] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [location, setLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [routeStations, setRouteStations] = useState([]);
  const [routeColor, setRouteColor] = useState("");
  const [busRoutes, setBusRoutes] = useState({});
  const [polylineCoordinates, setPolylineCoordinates] = useState([]); // Added state for polyline coordinates
  const [polylineColor, setPolylineColor] = useState(""); // Added state for polyline color
  const [isBusDropdownVisible, setBusDropdownVisible] = useState(false); // สำหรับ dropdown ใหม่

  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    fetchFonts().then(() => setFontLoaded(true));
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access location was denied."
        );
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 10000,
        timeout: 5000,
      });

      console.log("Location:", currentLocation);
      setLocation(currentLocation);
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      // Close the dropdown when the screen loses focus
      setDropdownVisible(false);
      setBusDropdownVisible(false); // Close the nested dropdown as well
    });
  
    return unsubscribe; // Cleanup the listener when the component unmounts
  }, [navigation]);

  const toggleDropdown = () => {
    if (dropdownVisible) {
      setDropdownVisible(false);
      setBusDropdownVisible(false); // ปิด dropdown ย่อย
    } else {
      setDropdownVisible(true);
    }
  };

  // Use setBusDropdownVisible for toggling bus route dropdown visibility
  const toggleBusDropdown = () => {
    setBusDropdownVisible(!isBusDropdownVisible); // toggle visibility
  };

  const handleBusRouteSelection = async (route) => {
    let routeKey, routeColorKey;

    switch (route) {
      case "Route 1":
        routeKey = "1A-สีแดง";
        routeColorKey = "1A-สีแดง";
        break;
      case "Route 2":
        routeKey = "1B-สีเหลือง";
        routeColorKey = "1B-สีเหลือง";
        break;
      case "Route 3":
        routeKey = "2-สีเขียว";
        routeColorKey = "2-สีเขียว";
        break;
      case "Route 4":
        routeKey = "3-ม่วง";
        routeColorKey = "3-ม่วง";
        break;
      case "Route 5":
        routeKey = "5-ฟ้า";
        routeColorKey = "5-ฟ้า";
        break;
      default:
        routeKey = null;
        routeColorKey = null;
    }

    if (routeKey && routeColorKey) {
      const db = getDatabase();
      const routeRef = ref(db, `EVroute/${routeKey}`);
      const colorRef = ref(db, `EVturn/${routeColorKey}`);

      const routeSnapshot = await get(routeRef);
      const colorSnapshot = await get(colorRef);

      if (routeSnapshot.exists() && colorSnapshot.exists()) {
        const routeData = routeSnapshot.val();
        const routeColorData = colorSnapshot.val();

        const stationsWithOrder = Object.entries(routeData)
          .map(([stationName, order]) => {
            return { name: stationName, order: parseInt(order) };
          })
          .sort((a, b) => a.order - b.order);

        const stations = stationsWithOrder.map((station) => station.name);

        const coordinates = routeColorData
          .filter((coord) => coord !== null)
          .map((coord) => {
            const coords = coord.split(",").map(Number);
            return { latitude: coords[0], longitude: coords[1] };
          });

        setRouteStations(stations);
        setSelectedBusRoute(routeKey);
        setBusRoutes({ ...busRoutes, [routeColorKey]: coordinates });

        setModalVisible(true);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } else {
        console.log("No data available for this route.");
      }
    } else {
      console.log("Invalid route selection.");
    }
  };

  const handleCloseModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  if (!fontLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const handleResetLocation = () => {
    setDropdownVisible(false);
    if (location) {
      console.log("Current Location:", location.coords);
      Alert.alert(
        "Current Location",
        `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`
      );
    } else {
      Alert.alert(
        "Location not available",
        "Cannot reset location. Location data is not available."
      );
    }
  };

  const handleToggleTraffic = () => {
    setShowTraffic(!showTraffic);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Pressable
          style={styles.searchBarContainer}
          onPress={() => navigation.navigate("RouteSearchScreen")}
        >
          <TextInput
            style={styles.searchBar}
            placeholder="คุณจะไปที่ไหน"
            placeholderTextColor="#888"
            editable={false}
          />
          <AntDesign
            name="search1"
            size={24}
            color="#888"
            style={styles.searchIcon}
          />
        </Pressable>

        <Pressable style={styles.dropdownButton} onPress={toggleDropdown}>
          <AntDesign
            name={dropdownVisible ? "up" : "down"}
            size={24}
            color="#2e2c2c"
          />
        </Pressable>
      </View>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          <Pressable style={styles.dropdownItem} onPress={toggleBusDropdown}>
            <Ionicons name="bus-outline" size={24} color="#2e2c2c" />
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={handleResetLocation}>
            <MaterialIcons name="gps-fixed" size={24} color="#2e2c2c" />
          </Pressable>
          <Pressable style={styles.dropdownItem} onPress={handleToggleTraffic}>
            <FontAwesome5 name="traffic-light" size={24} color="#2e2c2c" />
          </Pressable>
        </View>
      )}

      {dropdownVisible && isBusDropdownVisible && (
        <View style={styles.busDropdown}>
          <Pressable
            style={styles.busDropdownItem}
            onPress={() => handleBusRouteSelection("Route 1")}
          >
            <Text style={[styles.colorText, { color: "#c80909" }]}>
              EV 1A - สีแดง
            </Text>
          </Pressable>
          <Pressable
            style={styles.busDropdownItem}
            onPress={() => handleBusRouteSelection("Route 2")}
          >
            <Text style={[styles.colorText, { color: "#e2c91f" }]}>
              EV 1B - สีเหลือง
            </Text>
          </Pressable>
          <Pressable
            style={styles.busDropdownItem}
            onPress={() => handleBusRouteSelection("Route 3")}
          >
            <Text style={[styles.colorText, { color: "#419528" }]}>
              EV 2 - สีเขียว
            </Text>
          </Pressable>
          <Pressable
            style={styles.busDropdownItem}
            onPress={() => handleBusRouteSelection("Route 4")}
          >
            <Text style={[styles.colorText, { color: "#7f2895" }]}>
              EV 3 - สีม่วง
            </Text>
          </Pressable>
          <Pressable
            style={styles.busDropdownItem}
            onPress={() => handleBusRouteSelection("Route 5")}
          >
            <Text style={[styles.colorText, { color: "#284bb5" }]}>
              EV 5 - สีฟ้า
            </Text>
          </Pressable>
        </View>
      )}

      <MyMapComponent
        selectedBusRoute={selectedBusRoute}
        showTraffic={showTraffic}
        userLocation={location}
        style={{ flex: 1 }}
      />

      {modalVisible && (
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ข้อมูลเส้นทาง</Text>

            <View style={styles.routeInfo}>
              <Text style={styles.routeText}>สถานีที่ผ่าน: {routeColor}</Text>
            </View>

            {/* Scrollable list of stations */}
            <ScrollView
              style={styles.stationScrollView}
              contentContainerStyle={styles.stationList}
            >
              {routeStations.map((station, index) => (
                <Text key={index} style={styles.stationText}>
                  {station}
                </Text>
              ))}
            </ScrollView>

            {/* Collapse button */}
            <Pressable style={styles.closeButton} onPress={handleCloseModal}>
              <Text style={styles.closeButtonText}>ปิด</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    marginTop: 135,
    // top:120, // กำหนดตำแหน่งของ search bar ด้านบน
    left: 10,
    right: 10,
    zIndex: 10, // ทำให้ search bar อยู่เหนือแผนที่
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 6,
    width: "80%",
    height: 52,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1.5,
    boxShadow: "0px 2px 1px rgba(0, 0, 0, 0.1)",
  },
  searchBar: {
    flex: 1,
    height: "100%",
    borderRadius: 12,
    paddingLeft: 10,
    fontSize: 16,
    fontFamily: "Prompt-Regular",
  },
  searchIcon: {
    marginRight: 10,
  },
  dropdownButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 6,
    marginLeft: 10,
    height: 52,
    width: 52,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1.5,
  },
  dropdown: {
    position: "absolute",
    top: 200, // Adjust this as needed for positioning
    right: "4%",
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1.5,
    zIndex: 1,
  },
  busDropdown: {
    position: "absolute",
    top: 200,
    left: "44%", // ตำแหน่งด้านซ้าย
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1.5,
    zIndex: 1,
  },
  busDropdownItem: {
    flexDirection: "row", // แนวแกน X
    paddingVertical: 7, // ลดระยะ Padding แนวตั้ง
    paddingHorizontal: 8, // ลดระยะ Padding แนวนอน
    width: 140, // ปรับขนาดความกว้าง
    justifyContent: "flex-start",
    alignItems: "center",
  },
  dropdownItem: {
    flexDirection: "row", // แนวแกน X
    padding: 10,
    width: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  colorText: {
    fontSize: 14,
    fontFamily: "Prompt-Regular",
    color: "#1e1e1e",
    marginLeft: 10, // Add some space between the icon and text
  },
  dropdownText: {
    fontFamily: "Prompt-Regular",
    color: "#1e1e1e",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Prompt-Bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  routeInfo: {
    marginBottom: 15,
  },
  routeText: {
    fontSize: 16,
    fontFamily: "Prompt-Regular",
    color: "#555",
  },
  stationScrollView: {
    flex: 1,
    marginVertical: 10,
  },
  stationList: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingBottom: 20,
  },
  stationText: {
    fontSize: 16,
    fontFamily: "Prompt-Regular",
    color: "#555",
    padding: 10,
    backgroundColor: "#eaeaea",
    borderRadius: 10,
    marginVertical: 5,
    width: "100%",
  },
  closeButton: {
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginTop: 15,
  },
  closeButtonText: {
    fontSize: 18,
    fontFamily: "Prompt-Medium",
    color: "#007AFF",
  },
});

export default HomeScreen;
