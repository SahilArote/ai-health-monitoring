import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Fonts } from '../../src/constants/typography';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { ProfileMenuItem } from '../../src/components/profile/ProfileMenuItem';
import { useAuthStore } from '../../src/stores/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of HealthGuard?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/welcome' as Href);
        },
      },
    ]);
  };

  const profile = user || {
    name: 'Sarah Chen',
    email: 's.chen@hospital.org',
    age: 34,
    height: `5'7"`,
    weight: '138 lb',
    bloodType: 'A+',
    healthProfileStatus: 'Complete',
    activeGoalsCount: 4,
    dataSharing: 'Care team only',
    biometricLock: 'Face ID',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>Profile</Text>

        {/* Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            {/* Avatar Circle */}
            <View style={styles.avatarBox}>
              <Text style={styles.avatarInitials}>SC</Text>
              <TouchableOpacity style={styles.cameraBadge}>
                <Ionicons name="camera" size={12} color={Colors.surface} />
              </TouchableOpacity>
            </View>

            {/* Name & Status */}
            <View style={styles.userMeta}>
              <Text style={styles.userName}>{profile.name}</Text>
              <Text style={styles.userEmail}>{profile.email}</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active monitoring</Text>
              </View>
            </View>
          </View>

          {/* Physical Stats Row */}
          <View style={styles.statsBar}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{profile.age}</Text>
              <Text style={styles.statLbl}>Age</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{profile.height}</Text>
              <Text style={styles.statLbl}>Height</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{profile.weight}</Text>
              <Text style={styles.statLbl}>Weight</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{profile.bloodType}</Text>
              <Text style={styles.statLbl}>Blood Type</Text>
            </View>
          </View>
        </View>

        {/* HEALTH Section */}
        <SectionHeader title="HEALTH" />
        <View style={styles.menuGroup}>
          <ProfileMenuItem
            iconName="heart-outline"
            title="Health Profile"
            value={profile.healthProfileStatus}
            showDivider
          />
          <ProfileMenuItem
            iconName="pulse-outline"
            title="Health Goals"
            value={`${profile.activeGoalsCount} active`}
            showDivider
          />
          <ProfileMenuItem
            iconName="document-text-outline"
            title="Records"
            showDivider
          />
          <ProfileMenuItem
            iconName="fitness-outline"
            title="Medications"
          />
        </View>

        {/* DEVICE Section */}
        <SectionHeader title="DEVICE" />
        <View style={styles.menuGroup}>
          <ProfileMenuItem
            iconName="watch-outline"
            title="HealthGuard Pro"
            value="Battery 84%"
            showDivider
          />
          <ProfileMenuItem
            iconName="notifications-outline"
            title="Notifications"
            value="Enabled"
          />
        </View>

        {/* PRIVACY & SECURITY Section */}
        <SectionHeader title="PRIVACY & SECURITY" />
        <View style={styles.menuGroup}>
          <ProfileMenuItem
            iconName="shield-checkmark-outline"
            title="Data Sharing"
            value={profile.dataSharing}
            showDivider
          />
          <ProfileMenuItem
            iconName="lock-closed-outline"
            title="Biometric Lock"
            value={profile.biometricLock}
          />
        </View>

        {/* SUPPORT Section */}
        <SectionHeader title="SUPPORT" />
        <View style={styles.menuGroup}>
          <ProfileMenuItem iconName="help-circle-outline" title="Help & FAQ" />
        </View>

        {/* Sign Out Card */}
        <View style={styles.menuGroup}>
          <ProfileMenuItem
            iconName="log-out-outline"
            title="Sign Out"
            isDanger
            onPress={handleSignOut}
          />
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          HealthGuard v4.2.1 · HIPAA Compliant
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80, // for floating SOS button
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    color: Colors.primary,
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  avatarInitials: {
    fontFamily: Fonts.bold,
    fontSize: 22,
    color: Colors.surface,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 2,
  },
  userEmail: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brand,
    marginRight: 6,
  },
  statusText: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    color: Colors.brand,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#F8FAF9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  statCol: {
    alignItems: 'center',
  },
  statVal: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.primary,
    marginBottom: 2,
  },
  statLbl: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  menuGroup: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 8,
  },
  footerText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginVertical: 20,
  },
});
