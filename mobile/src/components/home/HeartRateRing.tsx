import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';
import { Badge } from '../ui/Badge';
import { useVitalsStore } from '../../stores/vitalsStore';

export const HeartRateRing: React.FC = () => {
  const { currentHeartRate } = useVitalsStore();

  const size = 200;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Progress curve for visual matching of Figma (approx 75% arc)
  const progress = 0.75;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.card}>
      <Text style={styles.headerLabel}>LIVE HEART RATE</Text>

      <View style={styles.ringContainer}>
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background Ring */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Colors.brandLight}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Active Teal Progress Ring */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Colors.brand}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>

        <View style={styles.centerContent}>
          <Text style={styles.bpmValue}>{currentHeartRate}</Text>
          <Text style={styles.bpmUnit}>BPM</Text>
          <Badge status="normal" label="Normal Range" style={styles.badge} />
        </View>
      </View>

      <Text style={styles.updatedText}>Last updated just now</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  headerLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  ringContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bpmValue: {
    fontFamily: Fonts.bold,
    fontSize: 54,
    color: Colors.textPrimary,
    lineHeight: 60,
  },
  bpmUnit: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: -4,
    marginBottom: 8,
  },
  badge: {
    marginTop: 4,
  },
  updatedText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 16,
  },
});
