import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Fonts } from '../../src/constants/typography';
import { Button } from '../../src/components/ui/Button';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Feather name="activity" size={32} color={Colors.surface} />
          </View>
        </View>

        {/* Title & Tagline */}
        <Text style={styles.title}>HealthGuard</Text>
        <Text style={styles.tagline}>
          Your wellness, understood. Clinical monitoring you can trust.
        </Text>

        {/* Today's Overview Card */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewHeader}>TODAY'S OVERVIEW</Text>
          <View style={styles.statsRow}>
            {/* Stat 1 */}
            <View style={styles.statColumn}>
              <Text style={styles.statValue}>
                68<Text style={styles.statUnit}> bpm</Text>
              </Text>
              <Text style={styles.statLabel}>Heart Rate</Text>
            </View>

            {/* Stat 2 */}
            <View style={styles.statColumn}>
              <Text style={styles.statValue}>
                98<Text style={styles.statUnit}> %</Text>
              </Text>
              <Text style={styles.statLabel}>SpO₂</Text>
            </View>

            {/* Stat 3 */}
            <View style={styles.statColumn}>
              <Text style={styles.statValue}>
                42<Text style={styles.statUnit}> ms</Text>
              </Text>
              <Text style={styles.statLabel}>HRV</Text>
            </View>
          </View>
        </View>

        {/* Trust Badge */}
        <View style={styles.trustBadge}>
          <Ionicons
            name="checkmark-circle-outline"
            size={18}
            color={Colors.brand}
            style={styles.trustIcon}
          />
          <Text style={styles.trustText}>
            Trusted by 50,000+ patients & physicians
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            variant="primary"
            onPress={() => router.push('/(auth)/register' as Href)}
            style={styles.primaryBtn}
          />

          <Button
            title="Sign In"
            variant="secondary"
            onPress={() => router.push('/(auth)/login' as Href)}
          />
        </View>

        {/* Terms Footer */}
        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.linkText}>Terms of Service</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>
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
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    color: Colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
    marginBottom: 32,
  },
  overviewCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  overviewHeader: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statColumn: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: Colors.brand,
  },
  statUnit: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statLabel: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brandLight,
    borderWidth: 1,
    borderColor: Colors.brandMuted,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 36,
    width: '100%',
    justifyContent: 'center',
  },
  trustIcon: {
    marginRight: 8,
  },
  trustText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.brand,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  primaryBtn: {
    marginBottom: 12,
  },
  termsText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: Colors.brand,
    textDecorationLine: 'underline',
  },
});
