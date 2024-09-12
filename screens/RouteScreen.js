import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Modal from "react-native-modal";

const RouteScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const routes = [
    { id: 1, title: "เส้นทางที่ 1", description: "รายละเอียดเส้นทางที่ 1", latitude: 13.736717, longitude: 100.523186 },
    { id: 2, title: "เส้นทางที่ 2", description: "รายละเอียดเส้นทางที่ 2", latitude: 13.737717, longitude: 100.524186 },
  ];

  const handleMarkerPress = (route) => {
    setSelectedRoute(route);
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 13.736717,
          longitude: 100.523186,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {routes.map((route) => (
          <Marker
            key={route.id}
            coordinate={{ latitude: route.latitude, longitude: route.longitude }}
            title={route.title}
            onPress={() => handleMarkerPress(route)}
          />
        ))}
      </MapView>
      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedRoute?.title}</Text>
          <Text style={styles.modalDescription}>{selectedRoute?.description}</Text>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
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
    backgroundColor: "#FFFFFF",
  },
  map: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 4,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RouteScreen;
