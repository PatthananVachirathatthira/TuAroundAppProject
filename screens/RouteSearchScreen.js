import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const RouteSearchScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.dotColumn}>
          <Icon name="circle" size={10} color="#FFA500" style={styles.icon} />
          <Icon name="circle" size={7} color="#D3D3D3" style={styles.icon} />
          <Icon name="circle" size={7} color="#D3D3D3" style={styles.icon} />
        </View>
        <View style={styles.inputContainer}>
        <Text style={styles.label}>จุดเริ่มต้น</Text>
          <TextInput 
            style={styles.input} 
            placeholder="ตำแหน่งปัจจุบัน"
            placeholderTextColor="#D3D3D3"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.dotColumn}>
          <Icon name="circle" size={7} color="#D3D3D3" style={styles.icon} />
          <Icon name="circle" size={7} color="#D3D3D3" style={styles.icon} />
          <Icon name="circle" size={10} color="#FFA500" style={styles.icon} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>จุดหมาย</Text>
          <TextInput 
            style={styles.input}
            placeholder=""
            placeholderTextColor="#FFA500"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dotColumn: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 8,
  },
  icon: {
    marginBottom: 8,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8, // มุมโค้งมน
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  input: {
    height: 40,
    fontSize: 14,
    color: '#FFA500',
  },
  label: {
    fontSize: 14,
    color: '#FFA500',
  },
});

export default RouteSearchScreen;