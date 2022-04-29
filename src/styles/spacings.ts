import { dimensions } from './dimensions';

export const spacings = {
  TINY: 2,
  SMALL: 5,
  MEDIUM: 10,
  LARGE: 15,
  HUGE: 20,
  MASSIVE: 25,
  ABSOLUTE_OFFSET_MEDIUM: 75,
  ABSOLUTE_OFFSET_LARGE: dimensions.height / 15,
  ABSOLUTE_OFFSET_HUGE: dimensions.height / 5,
  hitSlopTiny: {top: 2, bottom: 2, left: 2, right: 2},
  hitSlopSmall: {top: 5, bottom: 5, left: 5, right: 5},
  hitSlopMedium: {top: 10, bottom: 10, left: 10, right: 10},
  hitSlopLarge: {top: 15, bottom: 15, left: 15, right: 15},
  hitSlopHuge: {top: 20, bottom: 20, left: 20, right: 20},
  hitSlopMassive: {top: 25, bottom: 25, left: 25, right: 25},
  bottomTabBar: 57 // optimal on Google Pixel
}
