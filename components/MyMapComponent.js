import React, { useEffect, useState } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { StyleSheet, View, Image } from 'react-native';
import { database, ref, onValue } from '../firebaseConfig';

const MyMapComponent = ({ selectedBusRoute, showTraffic, userLocation }) => {
  const [busStops, setBusStops] = useState([]);
  const [busRoutes, setBusRoutes] = useState({});
  const [routeColors] = useState({
    '1A-สีแดง': '#FF0000',
    '1B-สีเหลือง': '#FFFF00',
    '2-สีเขียว': '#008000',
    '3-ม่วง': '#800080',
    '5-ฟ้า': '#0000FF',
  });

  useEffect(() => {
    // Fetch bus stops
    const busStopsRef = ref(database, 'EVstop');
    onValue(busStopsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const stops = Object.keys(data).map(key => {
          const coords = data[key].split(', ').map(coord => parseFloat(coord));
          return coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1]) 
            ? { latitude: coords[0], longitude: coords[1], title: key } 
            : null;
        }).filter(stop => stop !== null);
        setBusStops(stops);
      }
    });

    // Fetch bus routes from Firebase
    const routesRef = ref(database, 'EVturn');
    onValue(routesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedRoutes = Object.keys(data).reduce((acc, routeKey) => {
          const coordinates = data[routeKey]
            .filter(coord => coord !== null) // Check for non-null
            .map(coord => {
              const [latitude, longitude] = coord.split(', ').map(Number);
              return !isNaN(latitude) && !isNaN(longitude) ? { latitude, longitude } : null;
            })
            .filter(coord => coord !== null);
          acc[routeKey] = coordinates; // Store processed coordinates
          return acc;
        }, {});
        setBusRoutes(fetchedRoutes); // Set busRoutes
      }
    });
  }, []);
  
  const initialRegion = {
    latitude: userLocation ? userLocation.latitude : 14.070074,
    longitude: userLocation ? userLocation.longitude : 100.604836,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Function to map route name to color
  const getRouteNameWithColor = (routeNumber) => {
    return Object.keys(routeColors).find(routeName => routeName.startsWith(routeNumber));
  };

  const mappedRouteName = getRouteNameWithColor(selectedBusRoute);
  console.log('Mapped Route Name:', mappedRouteName);

  const selectedRouteCoordinates = busRoutes[mappedRouteName] || [];
  console.log('Selected Route Coordinates:', selectedRouteCoordinates);


  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsTraffic={showTraffic}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {busStops.length === 0 && (
          <Marker coordinate={initialRegion} title="No Bus Stops Available" />
        )}
        
        {busStops.map((stop, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
            title={stop.title}
          >
            <Image
              source={require('../assets/images/bus-stop.png')}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
            />
          </Marker>
        ))}

        

        {/* Render polyline for the selected bus route */}
        {selectedRouteCoordinates.length > 0 && (
          <Polyline
            coordinates={selectedRouteCoordinates}
            strokeColor={routeColors[mappedRouteName]} // Use the correct color from routeColors
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
