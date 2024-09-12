import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

const MyMapComponent = ({ selectedBusRoute, showTraffic, userLocation }) => {
  const initialRegion = {
    latitude: userLocation ? userLocation.latitude : 13.736717, // ค่าเริ่มต้นหากไม่ได้ตำแหน่งผู้ใช้
    longitude: userLocation ? userLocation.longitude : 100.523186,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsTraffic={showTraffic}
        showsUserLocation={true}  // แสดงตำแหน่งของผู้ใช้
      >
        {selectedBusRoute && (
          <Marker
            coordinate={{ latitude: 13.736717, longitude: 100.523186 }} // ปรับเป็นตำแหน่งของเส้นทางที่เลือก
            title={selectedBusRoute}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MyMapComponent;
