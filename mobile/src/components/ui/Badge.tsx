import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';
import { MetricStatus } from '../../types/vitals';

export interface BadgeProps {
  status: MetricStatus | 'normal' | 'caution' | 'critical' | 'success';
  label?: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ status, label, style }) => {
  const getColors = () => {
    switch (status) {
      case 'normal':
      case 'success':
        return {
          bg: Colors.statusSuccessBg,
          text: Colors.statusSuccess,
          dot: Colors.statusSuccess,
          defaultLabel: 'Normal Range',
        };
      case 'caution':
        return {
          bg: Colors.statusCautionBg,
          text: Colors.statusCaution,
          dot: Colors.statusCaution,
          defaultLabel: 'Caution',
        };
      case 'critical':
        return {
          bg: Colors.statusCriticalBg,
          text: Colors.statusCritical,
          dot: Colors.statusCritical,
          defaultLabel: 'Critical',
        };
      default:
        return {
          bg: Colors.brandLight,
          text: Colors.brand,
          dot: Colors.brand,
          defaultLabel: 'Normal',
        };
    }
  };

  const colors = getColors();
  const displayLabel = label || colors.defaultLabel;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }, style]}>
      <View style={[styles.dot, { backgroundColor: colors.dot }]} />
      <Text style={[styles.text, { color: colors.text }]}>{displayLabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontFamily: Fonts.medium,
    fontSize: 12,
  },
});
