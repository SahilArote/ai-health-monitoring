import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';
import { useDeviceStore } from '../../stores/deviceStore';

export const DeviceStatusBar: React.FC = () => {
  const { connectedDevice } = useDeviceStore();

  if (!connectedDevice) return null;

  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        <MaterialCommunityIcons name="watch" size={18} color={Colors.brand} />
        <Text style={styles.deviceName}>{connectedDevice.name}</Text>
        <View style={styles.dot} />
        <Text style={styles.statusText}>Connected</Text>
      </View>
      <View style={styles.rightGroup}>
        <Ionicons name="wifi-outline" size={14} color={Colors.textSecondary} />
        <Text style={styles.divider}>—</Text>
        <Ionicons name="battery-charging" size={16} color={Colors.textSecondary} />
        <Text style={styles.batteryText}>{connectedDevice.battery}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceName: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.textPrimary,
    marginLeft: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brand,
    marginHorizontal: 6,
  },
  statusText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.brand,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    color: Colors.textTertiary,
    marginHorizontal: 4,
    fontSize: 10,
  },
  batteryText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
});
