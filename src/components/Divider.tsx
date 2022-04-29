import React from 'react';
import { View, StyleSheet } from 'react-native';

interface DividerProps {
  widthPercentage?: number  // A decimal between 0 and 1 indicating percentage of screen width
  color: string
}

// This is a simple horizontal line that visually divides content on a page.  
const Divider = ({ widthPercentage, color }: DividerProps) => {
  // Default divider's width to parent container width, otherwise use number representing percent
  let width = widthPercentage ? `\"${widthPercentage}%\"` : "100%";  

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
