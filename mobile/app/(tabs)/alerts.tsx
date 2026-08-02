import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Fonts } from '../../src/constants/typography';
import { Chip } from '../../src/components/ui/Chip';
import { AlertCard } from '../../src/components/alerts/AlertCard';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { useAlertStore } from '../../src/stores/alertStore';
import { AlertItem, AlertSeverity } from '../../src/types/alerts';

export default function AlertsScreen() {
  const { alerts, filter, setFilter, unreadCount } = useAlertStore();

  const filteredAlerts =
    filter === 'ALL'
      ? alerts
      : alerts.filter((a: AlertItem) => a.severity === filter);

  // Group alerts by dateGroup
  const groupedAlerts: { [key: string]: AlertItem[] } = {};
  filteredAlerts.forEach((alert: AlertItem) => {
    if (!groupedAlerts[alert.dateGroup]) {
      groupedAlerts[alert.dateGroup] = [];
    }
    groupedAlerts[alert.dateGroup].push(alert);
  });

  const getCount = (type: 'ALL' | AlertSeverity) => {
    if (type === 'ALL') return alerts.length;
    return alerts.filter((a: AlertItem) => a.severity === type).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Alerts</Text>
            <Text style={styles.unreadText}>{unreadCount} unread</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
            {unreadCount > 0 && <View style={styles.redDot} />}
          </TouchableOpacity>
        </View>

        {/* Filter Chips Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          <Chip
            label="All"
            count={getCount('ALL')}
            isActive={filter === 'ALL'}
            onPress={() => setFilter('ALL')}
          />
          <Chip
            label="Critical"
            count={getCount('critical')}
            isActive={filter === 'critical'}
            onPress={() => setFilter('critical')}
          />
          <Chip
            label="Caution"
            count={getCount('caution')}
            isActive={filter === 'caution'}
            onPress={() => setFilter('caution')}
          />
          <Chip
            label="Normal"
            count={getCount('normal')}
            isActive={filter === 'normal'}
            onPress={() => setFilter('normal')}
          />
        </ScrollView>

        {/* Alert Cards Grouped by Date */}
        {Object.keys(groupedAlerts).map((dateGroup: string) => (
          <View key={dateGroup}>
            <SectionHeader title={dateGroup} />
            {groupedAlerts[dateGroup].map((alert: AlertItem) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </View>
        ))}
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
    paddingTop: 16,
    paddingBottom: 80, // for floating SOS button
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    color: Colors.primary,
    marginBottom: 2,
  },
  unreadText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.sos,
    position: 'absolute',
    top: 10,
    right: 12,
  },
  filterScroll: {
    marginBottom: 16,
    marginHorizontal: -20,
  },
  filterContainer: {
    paddingHorizontal: 20,
  },
});
