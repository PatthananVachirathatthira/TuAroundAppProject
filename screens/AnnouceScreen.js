import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { database, ref, onValue } from '../firebaseConfig';

const { width } = Dimensions.get('window');

const AnnounceScreen = ({ route }) => {
  const { type } = route.params;
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = () => {
      const announcementRef = ref(database, 'Notify/Notice/' + type); // ดึงข้อมูลตาม type A, B, C
      onValue(announcementRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setAnnouncement(data);
        }
        setLoading(false); // เปลี่ยนสถานะ loading เมื่อดึงข้อมูลเสร็จ
      });
    };

    fetchAnnouncement();
  }, [type]);

  const renderContent = () => {
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (announcement) {
    // ตรวจสอบว่าแต่ละฟิลด์มีข้อมูลหรือไม่
    const head = announcement.Head || "ไม่มีหัวข้อ";
    const dateTime = announcement.DateTime || "ไม่มีข้อมูลเวลา";
    const description = announcement.Des || "ไม่มีรายละเอียดเพิ่มเติม";

    return (
      <View style={styles.contentContainer}>
        <Text style={styles.header}>{head}</Text>
        <Text style={styles.date}>{dateTime}</Text>
        <Text style={styles.additionalInfoText}>{description}</Text>
      </View>
    );
  }

  return <Text>ไม่มีข้อมูลประกาศ</Text>; // กรณีที่ไม่มีข้อมูลเลย
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
    alignItems: 'center',
    marginTop: 85,
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
    marginTop: 10,
    textAlign: 'left',
  },
});

export default AnnounceScreen;
