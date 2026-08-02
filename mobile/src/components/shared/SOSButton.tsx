import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';

export const SOSButton: React.FC = () => {
  const handleSOSPress = () => {
    Alert.alert(
      'Emergency SOS Triggered',
      'Contacting emergency services and notifying care team...',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm Call', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.container}
      onPress={handleSOSPress}
    >
      <Text style={styles.text}>SOS</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.sos,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.sos,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 999,
  },
  text: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.surface,
    letterSpacing: 0.5,
  },
});
