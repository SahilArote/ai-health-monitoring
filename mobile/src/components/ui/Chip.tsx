import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';

export interface ChipProps {
  label: string;
  count?: number;
  isActive?: boolean;
  onPress?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  count,
  isActive = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.chip,
        isActive ? styles.activeChip : styles.inactiveChip,
      ]}
    >
      <Text style={[styles.label, isActive ? styles.activeText : styles.inactiveText]}>
        {label}
      </Text>
      {count !== undefined && (
        <View
          style={[
            styles.countBadge,
            isActive ? styles.activeCountBadge : styles.inactiveCountBadge,
          ]}
        >
          <Text
            style={[
              styles.countText,
              isActive ? styles.activeCountText : styles.inactiveCountText,
            ]}
          >
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: Colors.primary,
  },
  inactiveChip: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 13,
  },
  activeText: {
    color: Colors.surface,
  },
  inactiveText: {
    color: Colors.textSecondary,
  },
  countBadge: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  activeCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  inactiveCountBadge: {
    backgroundColor: Colors.background,
  },
  countText: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
  },
  activeCountText: {
    color: Colors.surface,
  },
  inactiveCountText: {
    color: Colors.textSecondary,
  },
});
