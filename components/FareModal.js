import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';

const FareModal = ({ visible, onClose, origin }) => {
    const [fares, setFares] = useState({});

    useEffect(() => {
        if (origin) {
            const db = getDatabase();
            const faresRef = ref(db, `fee/${origin}`);
            onValue(faresRef, (snapshot) => {
                const data = snapshot.val();
                setFares(data || {});
            });
        }
    }, [origin]);

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <Button title="ปิด" onPress={onClose} />
                <ScrollView>
                    <Text style={styles.title}>ข้อมูลค่าโดยสาร</Text>
                    {Object.entries(fares).map(([destination, routes]) => (
                        <View key={destination} style={styles.routeContainer}>
                            <Text style={styles.destination}>{destination}</Text>
                            {Object.entries(routes).map(([route, fee]) => (
                                <Text key={route}>
                                    {route}: {fee} บาท
                                </Text>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    routeContainer: {
        marginBottom: 15,
    },
    destination: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default FareModal;
