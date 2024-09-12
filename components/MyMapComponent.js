// import React from "react";
// import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
// import Constants from 'expo-constants';

// const containerStyle = {
//   width: '100%',
//   height: '400px'
// };

// // Updated coordinates
// const center = {
//   lat: 14.071119, // Latitude
//   lng: 100.605789 // Longitude
// };

// // Example bus stops
// const busStops = [
//   { lat: 14.070119, lng: 100.606789 }, // Example coordinates for bus stop 1
//   { lat: 14.072119, lng: 100.604789 }  // Example coordinates for bus stop 2
// ];

// const MyMapComponent = () => {
//   const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey; // Access the API key from Constants

//   return (
//     <LoadScript googleMapsApiKey={apiKey}>
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={15} // Adjust zoom level as needed
//       >
//         {/* Marker for the center location */}
//         <MarkerF position={center} />
        
//         {/* Markers for bus stops */}
//         {busStops.map((stop, index) => (
//           <MarkerF key={index} position={stop} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />
//         ))}
//       </GoogleMap>
//     </LoadScript>
//   );
// };

// export default MyMapComponent;

import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MyMapComponent = () => {
  const center = {
    latitude: 14.071119,
    longitude: 100.605789,
  };

  const busStops = [
    { latitude: 14.070119, longitude: 100.606789 },
    { latitude: 14.072119, longitude: 100.604789 },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          ...center,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Marker for the center location */}
        <Marker coordinate={center} />

        {/* Markers for bus stops */}
        {busStops.map((stop, index) => (
          <Marker key={index} coordinate={stop} pinColor="blue" />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: 400,
  },
});

export default MyMapComponent;
