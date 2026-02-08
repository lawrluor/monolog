declare module 'react-native-svg-charts' {
  import { ViewStyle } from 'react-native';
  import * as React from 'react';

  export interface ChartProps {
    style?: ViewStyle;
    data: any[];
    svg?: any;
    contentInset?: { top?: number; bottom?: number; left?: number; right?: number };
    yMin?: number;
    yMax?: number;
    xMin?: number;
    xMax?: number;
    curve?: any;
    children?: React.ReactNode;
  }

  export class LineChart extends React.Component<ChartProps> { }
  export class Path extends React.Component<any> { }
  export class XAxis extends React.Component<any> { }
  // Add other components as needed
}
