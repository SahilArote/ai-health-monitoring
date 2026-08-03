import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';

export interface IconContainerProps {
  children: React.ReactNode;
  size?: number;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const IconContainer: React.FC<IconContainerProps> = ({
  children,
  size = 40,
  backgroundColor = Colors.brandLight,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
