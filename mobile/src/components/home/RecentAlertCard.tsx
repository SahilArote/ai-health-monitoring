import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';
import { AlertItem } from '../../types/alerts';
import { IconContainer } from '../ui/IconContainer';

export interface RecentAlertCardProps {
  alert: AlertItem;
  onPress?: () => void;
}

export const RecentAlertCard: React.FC<RecentAlertCardProps> = ({ alert, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Recent Alerts</Text>
      <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={onPress}>
        <IconContainer
          size={40}
          backgroundColor={Colors.statusCautionBg}
          style={styles.iconContainer}
        >
          <Ionicons name="warning-outline" size={20} color={Colors.statusCaution} />
        </IconContainer>

        <View style={styles.content}>
          <View style={styles.topRow}>
            <Text style={styles.title}>{alert.title}</Text>
            <Text style={styles.time}>2h ago</Text>
          </View>
          <Text style={styles.description}>{alert.description}</Text>
        </View>

        <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    marginBottom: 80, // padding for floating SOS button
  },
  sectionHeader: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FBE8CC', // amber tint border from Figma 6.2
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  time: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  description: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
