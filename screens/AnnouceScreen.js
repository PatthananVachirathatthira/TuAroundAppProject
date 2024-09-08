import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
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
          </View>
        );
      case 'B':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.header}>การปรัปปรุง EV สาย B</Text>
            <Text style={styles.date}>32 สิงหา 2024-5.00</Text>
          </View>
        );
      case 'C':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.header}>การปรัปปรุง EV สาย C</Text>
            <Text style={styles.date}>32 สิงหา 2024-5.00</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderAdditionalInfo = () => {
    switch (type) {
      case 'A':
        return (
          <View style={styles.additionalInfoContainer}>
            <Text style={styles.additionalInfoText}>
            Dolor voluptate aliquip et duis exercitation quis laborum ad. Dolore nulla exercitation nulla sunt pariatur consequat reprehenderit labore proident nisi fugiat non. Adipisicing aute sunt dolore irure Lorem elit esse voluptate amet fugiat.
            </Text>
          </View>
        );
      case 'B':
        return (
          <View style={styles.additionalInfoContainer}>
            <Text style={styles.additionalInfoText}>
            Nostrud in est occaecat occaecat cupidatat ex ex. Cupidatat officia consequat amet cupidatat sint in proident excepteur adipisicing et eiusmod ex qui. Do enim dolore qui laboris tempor in eiusmod. Voluptate sunt irure commodo laboris enim veniam aliqua consequat cillum occaecat commodo aute. Sunt commodo exercitation et qui adipisicing ad sit excepteur labore reprehenderit deserunt minim elit.Occaecat officia irure ex laboris anim laboris aliqua nulla ullamco et officia aliqua irure. Deserunt amet tempor mollit adipisicing reprehenderit culpa mollit fugiat eiusmod minim labore cillum. Sint pariatur ad minim cupidatat sit sunt in est exercitation ipsum id eu. Minim cupidatat minim esse reprehenderit tempor aute in. Aute consectetur commodo aliqua veniam culpa exercitation eu est non tempor dolor. Ea cupidatat duis laborum enim.
            </Text>
          </View>
        );
      case 'C':
        return (
          <View style={styles.additionalInfoContainer}>
            <Text style={styles.additionalInfoText}>
            Tempor nulla ad id irure eu sint pariatur non ad aliquip commodo Lorem labore Lorem. Pariatur cillum quis aliquip nostrud cupidatat quis. Laboris sit nostrud ad ullamco. Do anim magna in et velit mollit enim veniam id pariatur Lorem ut. Tempor nulla ex adipisicing amet sit ad aute sunt aliquip do reprehenderit ullamco nisi sint. Labore minim ex exercitation exercitation laborum duis veniam anim do ut fugiat. Deserunt incididunt magna amet exercitation adipisicing consectetur adipisicing cillum laborum amet et veniam esse.
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
        {renderAdditionalInfo()}
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
    paddingTop: 14,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#f5f5f5',
    marginBottom: 15, // เพิ่มระยะห่างระหว่างกล่อง
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
  },
  additionalInfoContainer: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#f5f5f5', // สีพื้นหลังของกล่องข้อความยาว
    marginBottom: 20, // เพิ่มระยะห่างระหว่างกล่อง
  },
  additionalInfoText: {
    fontSize: 16,
    fontFamily: 'Prompt-Regular',
    color: '#6e6e6e',
  },
});

export default AnnounceScreen;
