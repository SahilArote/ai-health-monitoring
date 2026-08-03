import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';
import { ActivityData } from '../../types/vitals';

export interface ActivitySummaryProps {
  activity: ActivityData;
}

export const ActivitySummary: React.FC<ActivitySummaryProps> = ({ activity }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Today's Activity</Text>
      <View style={styles.card}>
        {/* Steps Column */}
        <View style={styles.column}>
          <View style={styles.itemHeader}>
            <Ionicons name="footsteps-outline" size={16} color={Colors.brand} />
            <Text style={styles.itemTitle}>Steps</Text>
          </View>
          <Text style={styles.value}>{activity.steps.current.toLocaleString()}</Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(activity.steps.current / activity.steps.goal) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.goalText}>Goal: {activity.steps.goal.toLocaleString()}</Text>
        </View>

        <View style={styles.divider} />

        {/* Sleep Column */}
        <View style={styles.column}>
          <View style={styles.itemHeader}>
            <Ionicons name="moon-outline" size={16} color={Colors.brand} />
            <Text style={styles.itemTitle}>Sleep</Text>
          </View>
          <Text style={styles.value}>
            {activity.sleep.hours}h {activity.sleep.minutes}m
          </Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${((activity.sleep.hours + activity.sleep.minutes / 60) / activity.sleep.goalHours) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.goalText}>Goal: {activity.sleep.goalHours}h</Text>
        </View>

        <View style={styles.divider} />

        {/* Calories Column */}
        <View style={styles.column}>
          <View style={styles.itemHeader}>
            <Ionicons name="flame-outline" size={16} color={Colors.brand} />
            <Text style={styles.itemTitle}>Calories</Text>
          </View>
          <Text style={styles.value}>{activity.calories.current.toLocaleString()}</Text>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(activity.calories.current / activity.calories.goal) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.goalText}>Goal: {activity.calories.goal.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionHeader: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemTitle: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  value: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.brand,
    borderRadius: 2,
  },
  goalText: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.textTertiary,
  },
});
