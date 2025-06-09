import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;
const chartHeight = 220;

const Chart = ({ labels = [], data = [] }) => {
  // Provide fallback data if empty
  const chartLabels = labels.length ? labels : ['1', '5', '10', '15', '20', '25', '30'];
  const chartDataPoints = data.length ? data : [1000, 1200, 800, 1500, 1800, 1600, 1900];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartDataPoints,
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(255, 138, 0, ${opacity})`, // bright orange stroke
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#FFF',
    backgroundGradientTo: '#FFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(107, 66, 38, ${opacity})`, // warm dark brown labels
    labelColor: (opacity = 1) => `rgba(107, 66, 38, ${opacity})`,
    propsForDots: {
      r: '6',
      strokeWidth: '3',
      stroke: '#FF8A00', // bright orange border around dots
      fill: '#FF5722', // deep orange fill
    },
    propsForLabels: {
      fontSize: 12,
      fontWeight: '600',
    },
    yAxisLabel: '₹',
  };

  const chartWidth = screenWidth - 32;
  const spacing = chartWidth / (chartLabels.length - 1);

  // Calculate Y position for a given value on chart (approximate)
  const getYPosition = (value) => {
    const maxValue = Math.max(...chartDataPoints);
    const minValue = Math.min(...chartDataPoints);
    const range = maxValue - minValue || 1;

    // invert Y because coordinate origin is top-left
    // add bottom padding of ~28px to prevent label cutoff
    return ((maxValue - value) / range) * chartHeight + 20;
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={chartWidth}
        height={chartHeight}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={false}
      />
      {/* Overlay labels on data points */}
      <View style={[styles.labelsContainer, { width: chartWidth, height: chartHeight }]}>
        {chartDataPoints.map((value, index) => {
          // Center label horizontally above the dot
          let left = spacing * index - 20;
          if (left < 0) left = 0;
          if (left > chartWidth - 40) left = chartWidth - 40;

          // Position label vertically above the point with clamp
          let top = getYPosition(value) - 28;
          if (top < 0) top = 0;

          return (
            <View key={index} style={[styles.labelWrapper, { left, top }]}>
              <Text style={styles.dataLabel}>₹{value}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Chart;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    alignItems: 'center',
    position: 'relative',
  },
  chart: {
    borderRadius: 16,
  },
  labelsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  labelWrapper: {
    position: 'absolute',
    width: 40,
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 12,
    color: '#FF5722',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
