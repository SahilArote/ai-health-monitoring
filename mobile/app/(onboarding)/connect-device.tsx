import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Fonts } from '../../src/constants/typography';
import { Button } from '../../src/components/ui/Button';
import { IconContainer } from '../../src/components/ui/IconContainer';
import { useDeviceStore } from '../../src/stores/deviceStore';
import { DeviceInfo } from '../../src/types/device';

export default function ConnectDeviceScreen() {
  const router = useRouter();
  const { availableDevices, connectDevice, startScan, isScanning } =
    useDeviceStore();

  useEffect(() => {
    startScan();
  }, []);

  const handleSelectDevice = (id: string) => {
    connectDevice(id);
    router.push('/(onboarding)/device-connected' as Href);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connect Device</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>
          Make sure your smartwatch is powered on and in pairing mode.
        </Text>

        {/* Animated Ripple Graphic */}
        <View style={styles.radarContainer}>
          <View style={styles.outerRing}>
            <View style={styles.middleRing}>
              <View style={styles.innerRing}>
                <Ionicons name="bluetooth" size={32} color={Colors.brand} />
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.foundText}>
          {isScanning ? 'Scanning for devices...' : `Found ${availableDevices.length} devices`}
        </Text>

        {/* Device Cards */}
        {availableDevices.map((device: DeviceInfo) => (
          <TouchableOpacity
            key={device.id}
            activeOpacity={0.8}
            onPress={() => handleSelectDevice(device.id)}
            style={styles.deviceCard}
          >
            <IconContainer size={44} style={styles.deviceIcon}>
              <MaterialCommunityIcons name="watch" size={24} color={Colors.brand} />
            </IconContainer>

            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceModel}>{device.model}</Text>
            </View>

            <View style={styles.deviceMeta}>
              <Ionicons name="stats-chart" size={16} color={Colors.brand} />
              <View style={styles.batteryRow}>
                <Ionicons name="battery-charging" size={14} color={Colors.textSecondary} />
                <Text style={styles.batteryText}>{device.battery}%</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <Button
          title="Scan Again"
          variant="secondary"
          isLoading={isScanning}
          onPress={startScan}
          style={styles.scanBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.primary,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
    alignItems: 'center',
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  radarContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: '#E1EFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: '#CBE5E4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.brandLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foundText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textSecondary,
    marginVertical: 20,
  },
  deviceCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  deviceIcon: {
    marginRight: 14,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 2,
  },
  deviceModel: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  deviceMeta: {
    alignItems: 'flex-end',
  },
  batteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  batteryText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  scanBtn: {
    marginTop: 16,
  },
});
