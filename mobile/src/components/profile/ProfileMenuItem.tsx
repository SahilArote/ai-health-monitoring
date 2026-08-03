import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';
import { IconContainer } from '../ui/IconContainer';

export interface ProfileMenuItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  value?: string;
  isDanger?: boolean;
  onPress?: () => void;
  showDivider?: boolean;
}

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  iconName,
  title,
  value,
  isDanger = false,
  onPress,
  showDivider = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.container, showDivider && styles.divider]}
    >
      <IconContainer
        size={40}
        backgroundColor={isDanger ? '#FDF2F2' : Colors.brandLight}
        style={styles.iconContainer}
      >
        <Ionicons
          name={iconName}
          size={20}
          color={isDanger ? Colors.statusCritical : Colors.brand}
        />
      </IconContainer>

      <Text style={[styles.title, isDanger && styles.dangerTitle]}>{title}</Text>

      {value && <Text style={styles.valueText}>{value}</Text>}

      <Ionicons
        name="chevron-forward"
        size={16}
        color={Colors.textTertiary}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    marginRight: 14,
  },
  title: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  dangerTitle: {
    color: Colors.statusCritical,
    fontFamily: Fonts.semiBold,
  },
  valueText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    marginRight: 6,
  },
  chevron: {
    marginLeft: 4,
  },
});
