import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { database, ref, onValue } from "../firebaseConfig";

const SongthaewScreen = () => {
  const [data, setData] = useState({});
  const numColumns = 2; // จำนวนคอลัมน์

  useEffect(() => {
    const fetchData = () => {
      const songthaewRef = ref(database, "songthaew");
      onValue(songthaewRef, (snapshot) => {
        const songthaewData = snapshot.val();
        if (songthaewData) {
          setData(songthaewData);
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
      <FlatList
        data={songthaewRoutes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={numColumns}
        columnWrapperStyle={styles.rowWrapper} // จัดการแถว
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 110,
  },
  list: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  rowWrapper: {
    justifyContent: "space-between", 
  },
  itemContainer: {
    backgroundColor: "#f65d3c",
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10, // ระยะห่างระหว่างกล่องในแถว
    flex: 1,
    maxWidth: "45%", // ลดความกว้างของกล่องในแต่ละคอลัมน์
    alignSelf: "center", // จัดกล่องให้อยู่กลางแถว
    height: 140, // เพิ่มความสูงของกล่อง
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  routeText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontFamily: "Prompt-Bold",
    textAlign: "center",
    paddingBottom: 10,
    paddingTop: 10,
  },
  priceText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Prompt-Regular",
    textAlign: "center",
  },
});

export default SongthaewScreen;
