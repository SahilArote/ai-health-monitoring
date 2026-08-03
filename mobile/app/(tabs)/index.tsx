import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';
import { Colors } from '../../src/constants/colors';
import { Fonts } from '../../src/constants/typography';
import { DeviceStatusBar } from '../../src/components/home/DeviceStatusBar';
import { HeartRateRing } from '../../src/components/home/HeartRateRing';
import { VitalCard } from '../../src/components/home/VitalCard';
import { ActivitySummary } from '../../src/components/home/ActivitySummary';
import { RecentAlertCard } from '../../src/components/home/RecentAlertCard';
import { useVitalsStore } from '../../src/stores/vitalsStore';
import { useAuthStore } from '../../src/stores/authStore';
import { useAlertStore } from '../../src/stores/alertStore';
import { useDeviceStore } from '../../src/stores/deviceStore';

export default function HomeScreen() {
  const router = useRouter();
  const { liveVitals, activity, fetchSummary, loading } = useVitalsStore();
  const { user, fetchProfile } = useAuthStore();
  const { alerts, fetchAlerts } = useAlertStore();
  const { fetchDevices } = useDeviceStore();

  useEffect(() => {
    fetchSummary();
    fetchProfile();
    fetchAlerts();
    fetchDevices();
  }, []);

  const userName = user?.name ? user.name.split(' ')[0] : 'Patient';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.dateText}>Sunday, August 2</Text>
          <Text style={styles.greetingText}>Good evening, {userName}</Text>
        </View>

        {/* Device Status Bar */}
        <DeviceStatusBar />

        {/* Live Heart Rate Animated Ring */}
        <HeartRateRing />

        {/* Vitals Section Header */}
        <View style={styles.vitalsHeaderRow}>
          <Text style={styles.vitalsTitle}>Vitals</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/trends' as Href)}>
            <Text style={styles.viewTrendsText}>View trends ↗</Text>
          </TouchableOpacity>
        </View>

        {/* Vitals 2x2 Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <VitalCard item={liveVitals[0]} />
            <VitalCard item={liveVitals[1]} />
          </View>
          <View style={styles.gridRow}>
            <VitalCard item={liveVitals[2]} />
            <VitalCard item={liveVitals[3]} />
          </View>
        </View>

        {/* Today's Activity */}
        <ActivitySummary activity={activity} />

        {/* Recent Alert */}
        {alerts.length > 0 && (
          <RecentAlertCard
            alert={alerts[0]}
            onPress={() => router.push('/(tabs)/alerts' as Href)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  dateText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  greetingText: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: Colors.primary,
  },
  vitalsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 8,
  },
  vitalsTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.primary,
  },
  viewTrendsText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.brand,
  },
  gridContainer: {
    marginHorizontal: -6,
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: 'row',
  },
});
