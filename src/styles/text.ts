import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { dimensions } from './dimensions';

// two white png logos (one 1500 px wide one 1000 px wide)
// Circular Std. BOOK which is for any big paragraphs of text or smaller text (like the words "Email" "Password" Sign In, etc on the sign in/sign up page
// Circular Std. MEDIUM is for the dates "July 2021" etc on the grid/feed page, and also for the text & numbers on the emoji selection page
// Ignazio Regular is the font I used for the logo, I've been using it as the display typeface for the "Hello/Welcome Back" messages on the sign in screens

export const baseStyles = {
  // Do not apply fontWeight to custom fonts in Android, or it will not use custom font
  headerText: {
    fontFamily: 'CircularStd-Book',
    fontSize: dimensions.width / 10,
    color: colors.BACKGROUND,

  },
  bodyText: {
    fontFamily: 'CircularStd-Book',
    fontSize: dimensions.width / 27, // 14
    color: colors.PRIMARY,
  }
};

export const text = StyleSheet.create({
  h1: {
    ...baseStyles.headerText
  },
  h2: {
    ...baseStyles.headerText,
    fontSize: dimensions.width / 15
  },
  h3: {
    ...baseStyles.headerText,
    fontSize: dimensions.width / 20,
    fontFamily: 'CircularStd-Book',
  },
  h4: {
    ...baseStyles.headerText,
    fontSize: dimensions.width / 24,
  },
  h5: {
    ...baseStyles.headerText,
    fontSize: dimensions.width / 30,
  },
  p: {
    ...baseStyles.bodyText
  },
  footnote: {
    ...baseStyles.bodyText,
    fontSize: 12
  }
});