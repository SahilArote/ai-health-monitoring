import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';
import { VitalTrend } from '../../types/vitals';
import { IconContainer } from '../ui/IconContainer';
import { Badge } from '../ui/Badge';
import { MiniLineChart } from './MiniLineChart';

export interface TrendCardProps {
  trend: VitalTrend;
}

export const TrendCard: React.FC<TrendCardProps> = ({ trend }) => {
  const getIcon = () => {
    switch (trend.type) {
      case 'heart_rate':
        return <Feather name="activity" size={20} color={Colors.brand} />;
      case 'spo2':
        return <Ionicons name="water-outline" size={20} color={Colors.brand} />;
      case 'hrv':
        return <MaterialCommunityIcons name="lightning-bolt-outline" size={20} color={Colors.brand} />;
      default:
        return <Feather name="activity" size={20} color={Colors.brand} />;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.leftGroup}>
          <IconContainer size={40} style={styles.iconContainer}>
            {getIcon()}
          </IconContainer>
          <View>
            <Text style={styles.title}>{trend.title}</Text>
            <View style={styles.valueRow}>
              <Text style={styles.value}>
                {trend.currentValue} <Text style={styles.unit}>{trend.unit}</Text>
              </Text>
              <Badge status={trend.status} style={styles.badge} />
            </View>
          </View>
        </View>

        {/* Delta Tag */}
        <View style={styles.deltaPill}>
          <Text style={styles.deltaText}>{trend.delta}</Text>
        </View>
      </View>

      <MiniLineChart data={trend.data} strokeColor={Colors.brand} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  title: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.textPrimary,
    marginRight: 8,
  },
  unit: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  badge: {
    marginLeft: 4,
  },
  deltaPill: {
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deltaText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
