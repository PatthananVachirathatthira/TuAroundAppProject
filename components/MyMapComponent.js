import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import { database, ref, onValue } from '../firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';

const MyMapComponent = ({ selectedBusRoute, showTraffic, userLocation }) => {
  const [busStops, setBusStops] = useState([]);
  const [busRoutes, setBusRoutes] = useState({});
  const [location, setLocation] = useState(userLocation || {
    latitude: 14.070074,
    longitude: 100.604836,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const mapRef = useRef(null);

  const [routeColors] = useState({
    '1A-สีแดง': '#FF0000',
    '1B-สีเหลือง': '#FFFF00',
    '2-สีเขียว': '#008000',
    '3-ม่วง': '#800080',
    '5-ฟ้า': '#0000FF',
  });

  useEffect(() => {
    const busStopsRef = ref(database, 'EVstop');
    onValue(busStopsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const stops = Object.keys(data)
          .map((key) => {
            const coords = data[key].split(', ').map((coord) => parseFloat(coord));
            return coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])
              ? { latitude: coords[0], longitude: coords[1], title: key }
              : null;
          })
          .filter((stop) => stop !== null);
        setBusStops(stops);
      }
    });

    const routesRef = ref(database, 'EVturn');
    onValue(routesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedRoutes = Object.keys(data).reduce((acc, routeKey) => {
          const coordinates = data[routeKey]
            .map((coord) => {
              const [latitude, longitude] = coord.split(', ').map(Number);
              return !isNaN(latitude) && !isNaN(longitude) ? { latitude, longitude } : null;
            })
            .filter((coord) => coord !== null);
          acc[routeKey] = coordinates;
          return acc;
        }, {});
        setBusRoutes(fetchedRoutes);
      }
    });
  }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    const currentRegion = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setLocation(currentRegion);

    if (mapRef.current) {
      mapRef.current.animateToRegion(currentRegion, 1000);
    }
  };

  const getRouteNameWithColor = (routeNumber) => {
    return Object.keys(routeColors).find((routeName) =>
      routeName.startsWith(routeNumber)
    );
  };

  const mappedRouteName = getRouteNameWithColor(selectedBusRoute);
  const selectedRouteCoordinates = busRoutes[mappedRouteName] || [];

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={location}
        showsTraffic={showTraffic}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {busStops.length === 0 && (
          <Marker coordinate={location} title="No Bus Stops Available" />
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

        {selectedRouteCoordinates.length > 0 && (
          <Polyline
            coordinates={selectedRouteCoordinates}
            strokeColor={routeColors[mappedRouteName]}
            strokeWidth={3}
          />
        )}
      </MapView>

      {/* GPS Button */}
      <TouchableOpacity style={styles.gpsButton} onPress={getCurrentLocation}>
        <MaterialIcons name="gps-fixed" size={24} color="#1e1e1e" />
      </TouchableOpacity>
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
  gpsButton: {
    position: 'absolute',
    bottom: 70,
    right: 30,
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default MyMapComponent;
