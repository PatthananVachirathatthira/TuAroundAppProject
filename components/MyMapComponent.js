import React, { useEffect, useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { StyleSheet, View, Image } from 'react-native';
import { database, ref, onValue } from '../firebaseConfig';

const MyMapComponent = ({ selectedBusRoute, showTraffic, userLocation }) => {
  const [busStops, setBusStops] = useState([]);
  const [busRoutes, setBusRoutes] = useState({});
  const [routeColors, setRouteColors] = useState({
    '1A': '#FF0000', // สีแดงสำหรับสาย 1A
    '1B': '#FFFF00', // สีเหลืองสำหรับสาย 1B
    '2': '#008000',  // สีเขียวสำหรับสาย 2
    '3': '#800080',  // สีน้ำเงินสำหรับสาย 3
    '5': '#0000FF',  // สีน้ำเงินสำหรับสาย 5
  });

  useEffect(() => {
    // Fetch bus stops
    const busStopsRef = ref(database, 'EVstop');
    onValue(busStopsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const stops = Object.keys(data).map(key => {
          const coords = data[key].split(', ').map(coord => parseFloat(coord));
          if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
            return { latitude: coords[0], longitude: coords[1], title: key };
          }
          return null;
        }).filter(stop => stop !== null);
        setBusStops(stops);
      }
    });

    // Fetch bus routes from Firebase and filter out `null` values
    const routesRef = ref(database, 'EVturn');
    onValue(routesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedRoutes = Object.keys(data).reduce((acc, routeKey) => {
          const coordinates = data[routeKey]
            .filter(coord => coord !== null) // Remove null entries
            .map(coord => {
              const [latitude, longitude] = coord.split(', ').map(Number);
              if (!isNaN(latitude) && !isNaN(longitude)) {
                return { latitude, longitude };
              } else {
                console.error(`Invalid coordinates for ${routeKey}: ${coord}`);
                return null;
              }
            })
            .filter(coord => coord !== null); // Filter out invalid coordinates
          acc[routeKey] = coordinates;
          return acc;
        }, {});
        setBusRoutes(fetchedRoutes);
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
          >
            <Image
              source={require('../assets/bus-stop.png')}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
            />
          </Marker>
        ))}
        {selectedBusRoute && busRoutes[selectedBusRoute] && (
          <Polyline
            coordinates={busRoutes[selectedBusRoute]}
            strokeColor={routeColors[selectedBusRoute]} // ใช้สีประจำสายที่เลือก
            strokeWidth={3}
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
