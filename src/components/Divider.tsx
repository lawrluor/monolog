import React from 'react';
import { View, StyleSheet } from 'react-native';

interface DividerProps {
  widthPercentage?: number;  // percentage of screen width from 0 to 1
  color: string;
}

// This is a simple horizontal line that visually divides content on a page.  
const Divider = ({ widthPercentage, color }: DividerProps) => {
  return (
    <View style={[styles.divider, { 'width': widthPercentage ? `${widthPercentage}%` : "100%", 'borderBottomColor': color }]} />
  )
}

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: 1,
    alignSelf: 'center'
  }
});

export default Divider;
