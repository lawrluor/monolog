import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// console.log("DEVICE DIMENSIONS:", width, height);
// Pixel 2: 411.42857142857144 683.4285714285714
// iPhone XS Max: 414 896
// iPhone 11 Pro: 375 812
// iPhone SE/5: 320 568

export const dimensions = {
  width: width,
  height: height
}