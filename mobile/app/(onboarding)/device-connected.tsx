import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Fonts } from '../../src/constants/typography';
import { Button } from '../../src/components/ui/Button';
import { IconContainer } from '../../src/components/ui/IconContainer';
import { useDeviceStore } from '../../src/stores/deviceStore';
import { useAuthStore } from '../../src/stores/authStore';

export default function DeviceConnectedScreen() {
  const router = useRouter();
  const { connectedDevice } = useDeviceStore();
  const { completeOnboarding } = useAuthStore();

  const handleStartMonitoring = () => {
    completeOnboarding();
    router.replace('/(tabs)' as Href);
  };

  const device = connectedDevice || {
    name: 'HealthGuard Pro',
    model: 'HG-Pro Series 4',
    battery: 84,
    signalBars: 3,
    firmware: 'v4.2.1',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Large Checkmark Icon */}
        <View style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <Ionicons name="checkmark" size={44} color={Colors.surface} />
          </View>
        </View>

        {/* Success Title */}
        <Text style={styles.title}>Connected!</Text>
        <Text style={styles.subtitle}>
          {device.name} is synced and ready
        </Text>

        {/* Device Detail Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <IconContainer size={44} style={styles.iconBox}>
              <MaterialCommunityIcons name="watch" size={24} color={Colors.brand} />
            </IconContainer>

            <View style={styles.deviceTitleGroup}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceModel}>{device.model}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 3 Stats Columns */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{device.battery}%</Text>
              <Text style={styles.statLabel}>Battery</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{device.signalBars}/3 bars</Text>
              <Text style={styles.statLabel}>Signal</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{device.firmware}</Text>
              <Text style={styles.statLabel}>Firmware</Text>
            </View>
          </View>
        </View>

        {/* Start Monitoring Button */}
        <Button
          title="Start Monitoring"
          variant="primary"
          onPress={handleStartMonitoring}
          style={styles.startBtn}
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.brandLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: Colors.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 36,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 40,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    marginRight: 14,
  },
  deviceTitleGroup: {},
  deviceName: {
    fontFamily: Fonts.bold,
    fontSize: 17,
    color: Colors.primary,
  },
  deviceModel: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  startBtn: {
    width: '100%',
  },
});
