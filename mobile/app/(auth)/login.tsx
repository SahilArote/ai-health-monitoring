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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = email.trim() !== '' && password.length >= 6;

  const handleLogin = () => {
    if (!isFormValid) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(email);
      router.replace('/(tabs)' as Href);
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
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Sign in to access your health data & monitoring
        </Text>

        <Input
          label="Email address"
          placeholder="s.chen@hospital.org"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          isPassword
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <Button
          title="Sign In"
          variant="primary"
          disabled={!isFormValid}
          isLoading={isLoading}
          onPress={handleLogin}
          style={styles.submitBtn}
        />

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 16,
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.brand,
  },
  submitBtn: {
    marginBottom: 20,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  registerText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  registerLink: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: Colors.brand,
  },
});
