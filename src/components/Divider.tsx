import React from 'react';
import { View, StyleSheet } from 'react-native';

interface DividerProps {
  widthPercentage?: number;  // percentage of screen width from 0 to 1
  color: string;
}

// This is a simple horizontal line that visually divides content on a page.  
const Divider = ({ widthPercentage, color }: DividerProps) => {
  // Default divider's width to parent container width, otherwise use number representing percent
  let width = widthPercentage ? `${widthPercentage}%` : "100%";

  return (
    <View style={[styles.divider, { 'width': width, 'borderBottomColor': color }]} />
  )
}

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: 1,
    alignSelf: 'center'
  }
});

export default Divider;
