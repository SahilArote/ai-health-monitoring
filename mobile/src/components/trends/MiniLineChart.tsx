import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/typography';
import { ChartDataPoint } from '../../types/vitals';

export interface MiniLineChartProps {
  data: ChartDataPoint[];
  strokeColor?: string;
  yMin?: number;
  yMax?: number;
}

export const MiniLineChart: React.FC<MiniLineChartProps> = ({
  data,
  strokeColor = Colors.brand,
  yMin,
  yMax,
}) => {
  const width = 280;
  const height = 90;
  const paddingX = 30;
  const paddingY = 15;

  const values = data.map((d) => d.value);
  const minVal = yMin !== undefined ? yMin : Math.min(...values) - 5;
  const maxVal = yMax !== undefined ? yMax : Math.max(...values) + 5;

  // Compute SVG Points
  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
    const y =
      height -
      paddingY -
      ((d.value - minVal) / (maxVal - minVal)) * (height - paddingY * 2);
    return { x, y };
  });

  // Construct smooth SVG path d string
  const pathD = points.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  return (
    <View style={styles.container}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Subtle grid lines */}
        <Line
          x1={paddingX}
          y1={paddingY}
          x2={width - paddingX}
          y2={paddingY}
          stroke={Colors.chartGrid}
          strokeDasharray="4 4"
        />
        <Line
          x1={paddingX}
          y1={height / 2}
          x2={width - paddingX}
          y2={height / 2}
          stroke={Colors.chartGrid}
          strokeDasharray="4 4"
        />
        <Line
          x1={paddingX}
          y1={height - paddingY}
          x2={width - paddingX}
          y2={height - paddingY}
          stroke={Colors.chartGrid}
          strokeDasharray="4 4"
        />

        {/* Trend Line */}
        <Path d={pathD} stroke={strokeColor} strokeWidth={2.5} fill="none" />
      </Svg>

      {/* X Axis Day Labels */}
      <View style={styles.xAxis}>
        {data.map((d, index) => (
          <Text key={index} style={styles.xLabel}>
            {d.day}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 4,
  },
  xLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.textTertiary,
  },
});
