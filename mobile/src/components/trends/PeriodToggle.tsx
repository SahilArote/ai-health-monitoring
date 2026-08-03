import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';

export interface PeriodToggleProps {
  selectedPeriod: '7D' | '14D' | '30D';
  onSelect: (period: '7D' | '14D' | '30D') => void;
}

export const PeriodToggle: React.FC<PeriodToggleProps> = ({
  selectedPeriod,
  onSelect,
}) => {
  const periods: ('7D' | '14D' | '30D')[] = ['7D', '14D', '30D'];

  return (
    <View style={styles.container}>
      {periods.map((period) => {
        const isSelected = selectedPeriod === period;
        return (
          <TouchableOpacity
            key={period}
            activeOpacity={0.8}
            onPress={() => onSelect(period)}
            style={[styles.pill, isSelected && styles.selectedPill]}
          >
            <Text style={[styles.text, isSelected && styles.selectedText]}>
              {period}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#EAEFEF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  selectedPill: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  selectedText: {
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
  },
});
