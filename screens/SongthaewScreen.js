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
      <View style={styles.textContainer}>
        <Text style={styles.routeText}>{item.route}</Text>
        <View style={styles.priceWithCircle}>
          <View style={styles.circleBackground}>
            <Text style={styles.priceText}>{item.price}</Text>
          </View>
          <Text style={styles.unitText}> บาท</Text>
        </View>
      </View>
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
    paddingVertical: 100,
  },
  list: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  rowWrapper: {
    justifyContent: "space-between",
  },
  itemContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    flex: 1,
    maxWidth: "45%",
    alignSelf: "center",
    height: 120,
    justifyContent: "space-between",
    elevation: 5,
  },
  textContainer: {
    alignItems: "flex-start", // ชิดซ้าย
    paddingVertical: 10,
    justifyContent: "center", // จัดให้อยู่กลางในแนวตั้ง
  },
  routeText: {
    fontSize: 20,
    color: "#1e1e1e",
    fontFamily: "Prompt-Medium",
  },
  priceWithCircle: {
    flexDirection: "row", // จัดราคาและหน่วยในแถวเดียวกัน
    alignItems: "center",
    marginTop: 5,
  },
  circleBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f65d3c", // สีพื้นหลังวงกลม
    justifyContent: "center",
    alignItems: "center",
  },
  priceText: {
    color: "white", // สีของตัวเลขในวงกลม
    fontSize: 18, // ขนาดตัวเลข
    fontFamily: "Prompt-Bold",
  },
  unitText: {
    fontSize: 18, // ขนาดข้อความหน่วย "บาท"
    color: "#1e1e1e",
    fontFamily: "Prompt-Regular",
    marginLeft: 5, // เว้นระยะห่างจากวงกลม
  },
});

export default SongthaewScreen;
