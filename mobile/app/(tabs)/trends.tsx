import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../src/constants/colors';
import { Fonts } from '../../src/constants/typography';
import { PeriodToggle } from '../../src/components/trends/PeriodToggle';
import { TrendCard } from '../../src/components/trends/TrendCard';
import { useVitalsStore } from '../../src/stores/vitalsStore';
import { VitalTrend } from '../../src/types/vitals';

export default function TrendsScreen() {
  const { trends, selectedTrendPeriod, setTrendPeriod, fetchTrends } = useVitalsStore();

  useEffect(() => {
    fetchTrends();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Trends</Text>
          <Text style={styles.dateRange}>Jul 24 – Jul 30, 2026</Text>
        </View>

        {/* 7D / 14D / 30D Segmented Toggle */}
        <PeriodToggle
          selectedPeriod={selectedTrendPeriod}
          onSelect={setTrendPeriod}
        />

        {/* Trend Cards */}
        {trends.map((trend: VitalTrend) => (
          <TrendCard key={trend.type} trend={trend} />
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
    marginBottom: 16,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    color: Colors.primary,
    marginBottom: 2,
  },
  dateRange: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
