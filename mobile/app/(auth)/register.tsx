import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Fonts } from '../../src/constants/typography';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useAuthStore } from '../../src/stores/authStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = fullName.trim() !== '' && email.trim() !== '' && password.length >= 6 && agreed;

  const handleRegister = () => {
    if (!isFormValid) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      register(fullName, email);
      router.push('/(auth)/verify-email' as Href);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Join 50,000+ patients monitoring their health
        </Text>

        {/* Inputs */}
        <Input
          label="Full name"
          placeholder="Dr. Sarah Chen"
          value={fullName}
          onChangeText={setFullName}
        />

        <Input
          label="Email address"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          label="Password"
          placeholder="Min. 6 characters"
          isPassword
          value={password}
          onChangeText={setPassword}
        />

        {/* Checkbox Agreement */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setAgreed(!agreed)}
          style={styles.checkboxRow}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Ionicons name="checkmark" size={14} color={Colors.surface} />}
          </View>
          <Text style={styles.checkboxText}>
            I agree to HealthGuard's{' '}
            <Text style={styles.linkText}>Terms of Service</Text>,{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>, and{' '}
            <Text style={styles.linkText}>HIPAA Notice</Text>
          </Text>
        </TouchableOpacity>

        {/* Compliance Badges */}
        <View style={styles.complianceContainer}>
          <View style={styles.complianceRow}>
            <Ionicons name="checkmark-circle-outline" size={16} color={Colors.brand} />
            <Text style={styles.complianceText}>HIPAA-compliant data storage</Text>
          </View>
          <View style={styles.complianceRow}>
            <Ionicons name="checkmark-circle-outline" size={16} color={Colors.brand} />
            <Text style={styles.complianceText}>Clinician-reviewed algorithms</Text>
          </View>
          <View style={styles.complianceRow}>
            <Ionicons name="checkmark-circle-outline" size={16} color={Colors.brand} />
            <Text style={styles.complianceText}>256-bit AES encryption</Text>
          </View>
        </View>

        {/* Create Account Button */}
        <Button
          title="Create Account"
          variant="primary"
          disabled={!isFormValid}
          isLoading={isLoading}
          onPress={handleRegister}
          style={styles.submitBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    color: Colors.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 28,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
    backgroundColor: Colors.surface,
  },
  checkboxChecked: {
    backgroundColor: Colors.brand,
    borderColor: Colors.brand,
  },
  checkboxText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  linkText: {
    color: Colors.brand,
    fontFamily: Fonts.medium,
  },
  complianceContainer: {
    marginVertical: 16,
  },
  complianceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  complianceText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  submitBtn: {
    marginTop: 20,
  },
});
