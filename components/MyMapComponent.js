import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

// Import the map image
import mapImage from '../assets/images/map_image.png';

const MyMapComponent = () => {
  return (
    <View style={styles.container}>
      <Image source={mapImage} style={styles.mapImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapImage: {
    width: '100%',  // Ensures the image width matches the screen width
    height: 400,    // You can adjust this height to match your design
    resizeMode: 'cover', // This ensures the image scales appropriately to cover the area
  },
});

export default MyMapComponent;  // ส่งออก MyMapComponent เป็นค่าเริ่มต้น
