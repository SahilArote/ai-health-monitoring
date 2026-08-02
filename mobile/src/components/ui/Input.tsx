import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword = false,
  style,
  placeholderTextColor = Colors.textTertiary,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          !!error && styles.errorInput,
        ]}
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  focusedInput: {
    borderColor: Colors.brand,
  },
  errorInput: {
    borderColor: Colors.statusCritical,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.statusCritical,
    marginTop: 4,
  },
});
