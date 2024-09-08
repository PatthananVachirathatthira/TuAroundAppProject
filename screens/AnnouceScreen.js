import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window'); // ใช้ขนาดของหน้าจอ

const AnnounceScreen = ({ route }) => {
  const { type } = route.params;

  const renderContent = () => {
    switch (type) {
      case 'A':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.header}>การปรัปปรุง EV สาย A</Text>
            <Text style={styles.date}>32 สิงหา 2024-5.00</Text>
            {/* เพิ่มเนื้อหาเพิ่มเติมที่นี่ */}
          </View>
        );
      case 'B':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.header}>การปรัปปรุง EV สาย B</Text>
            <Text style={styles.date}>32 สิงหา 2024-5.00</Text>
            {/* เพิ่มเนื้อหาเพิ่มเติมที่นี่ */}
          </View>
        );
      case 'C':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.header}>การปรัปปรุง EV สาย C</Text>
            <Text style={styles.date}>32 สิงหา 2024-5.00</Text>
            {/* เพิ่มเนื้อหาเพิ่มเติมที่นี่ */}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  contentContainer: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 22,
    fontFamily: 'Prompt-Bold',
    color: '#f65d3c',
    marginBottom: 10,
  },
  date: {
    fontSize: 18,
    fontFamily: 'Prompt-Regular',
    color: '#1e1e1e',
  },
});

export default AnnounceScreen;
