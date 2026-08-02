import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noBorder?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  noBorder = false,
  ...props
}) => {
  return (
    <View
      style={[
        styles.card,
        noBorder ? styles.noBorder : styles.withBorder,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  withBorder: {
    borderWidth: 1,
    borderColor: Colors.border,
  },
  noBorder: {
    borderWidth: 0,
  },
});
