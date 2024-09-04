import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const TransportScreen = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Motorbike Taxi</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Taxi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // ให้กล่องขึ้นบนมากขึ้น
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 90, // ลดระยะห่างจากด้านบน
  },
  button: {
    backgroundColor: 'white', // สีพื้นหลังของปุ่ม
    borderRadius: 10, // ทำให้มุมปุ่มมน
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '85%', // ขนาดของปุ่ม
    height: 65,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 1,
    elevation: 2,
    justifyContent: 'center', // จัดตำแหน่งข้อความแนวตั้งกลาง
    alignItems: 'flex-start', // จัดตำแหน่งข้อความไปที่ด้านซ้ายของกล่อง
  },
  buttonText: {
    color: 'black', // สีข้อความ
    fontSize: 18,
    marginLeft: 10, // เพิ่มระยะห่างจากขอบด้านซ้ายของกล่อง
  },
});

export default TransportScreen;
