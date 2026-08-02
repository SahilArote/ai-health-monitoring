import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';
import { AlertItem } from '../../types/alerts';
import { IconContainer } from '../ui/IconContainer';
import { Badge } from '../ui/Badge';

export interface AlertCardProps {
  alert: AlertItem;
  onPress?: () => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onPress }) => {
  const getSeverityStyle = () => {
    switch (alert.severity) {
      case 'critical':
        return {
          leftBorder: Colors.statusCritical,
          iconBg: Colors.statusCriticalBg,
          iconColor: Colors.statusCritical,
          iconName: 'alert-circle-outline' as const,
        };
      case 'caution':
        return {
          leftBorder: Colors.statusCaution,
          iconBg: Colors.statusCautionBg,
          iconColor: Colors.statusCaution,
          iconName: 'warning-outline' as const,
        };
      case 'normal':
      default:
        return {
          leftBorder: Colors.statusSuccess,
          iconBg: Colors.statusSuccessBg,
          iconColor: Colors.statusSuccess,
          iconName: 'checkmark-circle-outline' as const,
        };
    }
  };

  const styleConfig = getSeverityStyle();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, { borderLeftColor: styleConfig.leftBorder }]}
    >
      <IconContainer
        size={40}
        backgroundColor={styleConfig.iconBg}
        style={styles.iconContainer}
      >
        <Ionicons name={styleConfig.iconName} size={20} color={styleConfig.iconColor} />
      </IconContainer>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title}>{alert.title}</Text>
          <Text style={styles.timestamp}>{alert.timestamp}</Text>
        </View>

        <Text style={styles.description}>{alert.description}</Text>

        <View style={styles.footerRow}>
          <Badge status={alert.severity} style={styles.badge} />
          {alert.metricType && alert.metricValue && (
            <Text style={styles.metricText}>
              {alert.metricType}: <Text style={styles.metricValue}>{alert.metricValue}</Text>
            </Text>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
    marginRight: 8,
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
  timestamp: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  description: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginRight: 8,
  },
  metricText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  metricValue: {
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
  },
});
