import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Fonts } from '../../src/constants/typography';
import { SOSButton } from '../../src/components/shared/SOSButton';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.brand,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarStyle: {
            backgroundColor: Colors.surface,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontFamily: Fonts.medium,
            fontSize: 11,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="trends"
          options={{
            title: 'Trends',
            tabBarIcon: ({ color }) => (
              <Feather name="trending-up" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="alerts"
          options={{
            title: 'Alerts',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'notifications' : 'notifications-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      {/* Floating SOS FAB */}
      <SOSButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
