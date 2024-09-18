import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { database, ref, onValue } from '../firebaseConfig'; // Import from root directory

const MyMapComponent = ({ selectedBusRoute, showTraffic, userLocation }) => {
  const [busStops, setBusStops] = useState([]);

  useEffect(() => {
  const busStopsRef = ref(database, 'EVstop');
  onValue(busStopsRef, (snapshot) => {
    const data = snapshot.val();
    console.log("Data from Firebase:", data); // ตรวจสอบข้อมูลที่ดึงมา
    if (data) {
      const stops = Object.keys(data).map(key => {
        const coords = data[key].split(', ').map(coord => parseFloat(coord));
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          return { latitude: coords[0], longitude: coords[1], title: key };
        }
        return null; // คืนค่า null ถ้าข้อมูลไม่ถูกต้อง
      }).filter(stop => stop !== null); // กรองค่าที่เป็น null ออก
      setBusStops(stops);
    }
  });
}, []);



  const initialRegion = {
    latitude: userLocation ? userLocation.latitude : 14.070074,
    longitude: userLocation ? userLocation.longitude : 100.604836,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
  style={styles.map}
  initialRegion={initialRegion}
  showsTraffic={showTraffic}
  showsUserLocation={true}
  zoomEnabled={true}
  scrollEnabled={true}
>
  {busStops.length === 0 && <Marker coordinate={initialRegion} title="No Bus Stops Available" />}
  {busStops.map((stop, index) => (
    <Marker
      key={index}
      coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
      title={stop.title}
    />
  ))}
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
