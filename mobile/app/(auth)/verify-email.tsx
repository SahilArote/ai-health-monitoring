import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { Fonts } from '../../src/constants/typography';
import { Button } from '../../src/components/ui/Button';
import { useAuthStore } from '../../src/stores/authStore';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { user, verifyOtp } = useAuthStore();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleDigitChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto focus next box
    if (text && index < 5) {
      const nextInput = `otp_input_${index + 1}`;
      // Logic handled by native inputs
    }
  };

  const isComplete = code.every((digit) => digit !== '');

  const handleVerify = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      verifyOtp(code.join(''));
      router.replace('/(onboarding)/connect-device' as Href);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Email Icon Container */}
        <View style={styles.iconBox}>
          <Ionicons name="mail-outline" size={32} color={Colors.brand} />
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{' '}
          <Text style={styles.emailText}>
            {user?.email || 's.chen@hospital.org'}
          </Text>
        </Text>

        {/* 6 Digit Inputs */}
        <View style={styles.otpRow}>
          {code.map((digit, idx) => (
            <TextInput
              key={idx}
              style={[styles.otpBox, digit !== '' && styles.otpBoxFilled]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleDigitChange(text, idx)}
            />
          ))}
        </View>

        {/* Verify Button */}
        <Button
          title="Verify Email"
          variant="primary"
          disabled={!isComplete}
          isLoading={isLoading}
          onPress={handleVerify}
          style={styles.verifyBtn}
        />

        {/* Resend Code Link */}
        <Text style={styles.resendText}>
          Didn't receive it? <Text style={styles.resendLink}>Resend code</Text>
        </Text>
      </KeyboardAvoidingView>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    paddingTop: 20,
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: Colors.brandLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
    marginBottom: 32,
  },
  emailText: {
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  otpBox: {
    width: 48,
    height: 54,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlign: 'center',
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: Colors.primary,
  },
  otpBoxFilled: {
    borderColor: Colors.brand,
    backgroundColor: Colors.brandLight,
  },
  verifyBtn: {
    marginBottom: 24,
  },
  resendText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  resendLink: {
    fontFamily: Fonts.semiBold,
    color: Colors.brand,
  },
});
