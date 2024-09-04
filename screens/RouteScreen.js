import React from "react";
import { View, Text, StyleSheet} from "react-native";

const RouteScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>รายละเอียดเส้นทาง</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
    paddingTop: 70,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
  },
  title: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RouteScreen;
