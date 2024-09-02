import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const selectOption = (option) => {
    setDropdownVisible(false);
    console.log('Selected:', option);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <TouchableOpacity
          style={styles.searchBarContainer}
          onPress={() => navigation.navigate('RouteSearchScreen')}
          activeOpacity={1}
        >
          <TextInput
            style={styles.searchBar}
            placeholder="คุณจะไปที่ไหน"
            placeholderTextColor="#888"
            editable={false}
          />
          <AntDesign
            name="search1"
            size={24}
            color="#888"
            style={styles.searchIcon}
            onPress={() => navigation.navigate('RouteSearchScreen')}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
          <AntDesign name={dropdownVisible ? 'up' : 'down'} size={24} color="black" />
        </TouchableOpacity>
      </View>

      {dropdownVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => selectOption('Option 1')}>
            <Ionicons name="bus-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => selectOption('Option 2')}>
           <MaterialIcons name="gps-fixed" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem} onPress={() => selectOption('Option 3')}>
            <FontAwesome5 name="traffic-light" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
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
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 6,
    width: '75%',
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 1,
    elevation: 1.5,
  },
  searchBar: {
    flex: 1,
    height: '100%',
    borderRadius: 30,
    paddingLeft: 10,
    fontSize: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  dropdownButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 6,
    marginLeft: 10,
    height: 52,
    width: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 1,
    elevation: 1.5,
  },
  dropdown: {
    position: 'absolute',
    top: 80,
    right: '4.5%',
    width: 52,  // Set width to match dropdownButton
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 1,
    elevation: 1.5,
    zIndex: 1,
  },
  dropdownItem: {
    width: 52,  // Match width of dropdownButton
    height: 52, // Match height of dropdownButton
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
