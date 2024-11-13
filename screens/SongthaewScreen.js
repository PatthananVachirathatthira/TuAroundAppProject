import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { database, ref, onValue } from "../firebaseConfig"; // Import firebase configuration

const SongthaewScreen = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = () => {
      const songthaewRef = ref(database, "songthaew"); // Reference to the "songthaew" node in Firebase
      onValue(songthaewRef, (snapshot) => {
        const songthaewData = snapshot.val(); // Get the data from the snapshot
        if (songthaewData) {
          setData(songthaewData); // Set the data to state
        }
      });
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.routeText}>{item.route}</Text>
      <Text style={styles.priceText}>{item.price} บาท</Text>
    </View>
  );

  const songthaewRoutes = Object.entries(data).map(([route, price]) => ({
    route,
    price,
  }));

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/songthaw.jpg')} // Path to your bus stop image
        style={styles.image}
      />
      <FlatList
        data={songthaewRoutes}
        renderItem={renderItem}
        keyExtractor={(item) => item.route}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF0", // สีพื้นหลังโทนส้มอ่อน
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 250, // ปรับขนาดให้สูงขึ้น
    resizeMode: "cover", // ปรับเป็น cover เพื่อให้ดูดีขึ้น
    borderRadius: 15, // เพิ่มมุมโค้งให้กับภาพ
    overflow: "hidden", // ซ่อนส่วนที่เกินออกไป
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: "#FFA500", // สีส้ม
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
    elevation: 5, // เพิ่มเงา
  },
  routeText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontFamily: "Prompt-Bold", 
  },
  priceText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Prompt-Regular", 
  },
});

export default SongthaewScreen;
