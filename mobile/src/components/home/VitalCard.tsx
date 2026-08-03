import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';
import { VitalMetric } from '../../types/vitals';
import { IconContainer } from '../ui/IconContainer';
import { Badge } from '../ui/Badge';

export interface VitalCardProps {
  item: VitalMetric;
}

export const VitalCard: React.FC<VitalCardProps> = ({ item }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'spo2':
        return <Ionicons name="water-outline" size={20} color={Colors.brand} />;
      case 'blood_pressure':
        return <Feather name="activity" size={20} color={Colors.brand} />;
      case 'hrv':
        return <MaterialCommunityIcons name="lightning-bolt-outline" size={20} color={Colors.brand} />;
      case 'temperature':
        return <Ionicons name="thermometer-outline" size={20} color={Colors.brand} />;
      default:
        return <Feather name="heart" size={20} color={Colors.brand} />;
    }
  };

  return (
    <View style={styles.card}>
      <IconContainer size={40} style={styles.icon}>
        {getIcon()}
      </IconContainer>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{item.value}</Text>
        <Text style={styles.unit}>{item.unit}</Text>
      </View>

      <Text style={styles.name}>{item.name}</Text>

      <Badge status={item.status} label="Normal" style={styles.badge} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    margin: 6,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  icon: {
    marginBottom: 12,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  value: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: Colors.textPrimary,
  },
  unit: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  name: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  badge: {
    marginTop: 4,
  },
});
