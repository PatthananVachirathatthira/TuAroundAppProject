import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.searchBarContainer}
        onPress={() => navigation.navigate('RouteSearchScreen')}
        activeOpacity={1} // ให้สามารถกดได้ทั้งกล่อง
      >
        <TextInput
          style={styles.searchBar}
          placeholder="คุณจะไปที่ไหน"
          placeholderTextColor="#888"
          editable={false} // ป้องกันการแก้ไขข้อความใน TextInput
        />
        <AntDesign
          name="search1"
          size={24}
          color="#888"
          style={styles.searchIcon}
          onPress={() => navigation.navigate('RouteSearchScreen')}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 6,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 1,
    elevation: 1.5,
    margin: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderRadius: 30,
    paddingLeft: 10,
    fontSize: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
});

export default HomeScreen