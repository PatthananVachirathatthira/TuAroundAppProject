import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';

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
            <Text style={styles.additionalInfoText}>
              Dolor voluptate aliquip et duis exercitation quis laborum ad. Dolore nulla exercitation nulla sunt pariatur consequat reprehenderit labore proident nisi fugiat non. Adipisicing aute sunt dolore irure Lorem elit esse voluptate amet fugiat.
            </Text>
          </View>
        );
      case 'B':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.header}>การปรัปปรุง EV สาย B</Text>
            <Text style={styles.date}>32 สิงหา 2024-5.00</Text>
            <Text style={styles.additionalInfoText}>
              Nostrud in est occaecat occaecat cupidatat ex ex. Cupidatat officia consequat amet cupidatat sint in proident excepteur adipisicing et eiusmod ex qui. Do enim dolore qui laboris tempor in eiusmod. Voluptate sunt irure commodo laboris enim veniam aliqua consequat cillum occaecat commodo aute. Sunt commodo exercitation et qui adipisicing ad sit excepteur labore reprehenderit deserunt minim elit.
            </Text>
          </View>
        );
      case 'C':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.header}>การปรัปปรุง EV สาย C</Text>
            <Text style={styles.date}>32 สิงหา 2024-5.00</Text>
            <Text style={styles.additionalInfoText}>
              Tempor nulla ad id irure eu sint pariatur non ad aliquip commodo Lorem labore Lorem. Pariatur cillum quis aliquip nostrud cupidatat quis. Laboris sit nostrud ad ullamco. Do anim magna in et velit mollit enim veniam id pariatur Lorem ut.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentWrapper}>
          {renderContent()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentWrapper: {
    alignItems: 'center', // จัดตำแหน่งให้ตรงกลาง
    marginTop: 85, // ปรับระยะห่างจากด้านบนของหน้าจอ
  },
  contentContainer: {
    width: width * 0.9,
    paddingTop: 10,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    fontFamily: 'Prompt-Medium',
    color: '#f65d3c',
    marginBottom: 5,
  },
  date: {
    fontSize: 15,
    fontFamily: 'Prompt-Regular',
    color: '#6e6e6e',
    marginBottom: 15,
  },
  additionalInfoText: {
    fontSize: 16,
    fontFamily: 'Prompt-Regular',
    color: '#6e6e6e',
    marginTop: 10, // เพิ่มระยะห่างระหว่างข้อความ
    textAlign: 'left',
  },
});

export default AnnounceScreen;
