import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';

export interface SectionHeaderProps {
  title: string;
  style?: TextStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, style }) => {
  return <Text style={[styles.title, style]}>{title}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 16,
  },
});
