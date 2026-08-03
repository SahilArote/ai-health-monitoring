import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  isLoading = false,
  fullWidth = true,
  disabled,
  style,
  textStyle,
  ...props
}) => {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? Colors.disabledBg : Colors.brand,
        };
      case 'secondary':
        return {
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: Colors.border,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          backgroundColor: Colors.sos,
        };
      default:
        return { backgroundColor: Colors.brand };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return { color: disabled ? Colors.disabledText : Colors.surface };
      case 'secondary':
        return { color: Colors.primary };
      case 'ghost':
        return { color: Colors.brand };
      case 'danger':
        return { color: Colors.surface };
      default:
        return { color: Colors.surface };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      style={[
        styles.base,
        fullWidth && styles.fullWidth,
        getContainerStyle(),
        style,
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? Colors.brand : Colors.surface}
          size="small"
        />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
