import React from 'react';
import { VictoryScatter, VictoryChart, VictoryTheme, VictoryAxis, VictoryLabel } from 'victory-native';
import { getAvgTotalAutoPoints, getAvgTotalEndGamePoints, getAvgTotalTeleopPoints } from '../../../models/StatsCalculations';
import { Text } from 'react-native';
import { PitModel } from '../../../models/PitModel';

interface ChartProps {
  data: PitModel[];
}

const Chart1: React.FC<ChartProps> = ({ data }) => {
  // Ensure data is available and has at least 5 matches for each team
  // TODO: Each PitModel has a matches array and a teamNumber
  

  console.log('filteredData', );

  if (data.length === 0) {
    return <Text>No sufficient data for visualization.</Text>;
  }

  // Processed data for scatter plot
  const processedData = data.map((pit) => {
    // Calculate averages for the last five matches for each team
    const lastFiveMatches = pit.matches?.slice(-5) ?? []; // Add nullish coalescing operator
    const avgTeleopPoints = getAvgTotalTeleopPoints(lastFiveMatches);
    const avgAutoEndGamePoints = getAvgTotalAutoPoints(lastFiveMatches) + getAvgTotalEndGamePoints(lastFiveMatches);

    return {
      x: avgTeleopPoints,
      y: avgAutoEndGamePoints,
      label: `Team ${pit.TeamNumber}`
    };
  });

  return (
    <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
      <VictoryScatter
        data={processedData}
        style={{ 
          data: { fill: "#c43a31" },
          labels: { fill: "#000", fontSize: 12, padding: 5 }
        }}
        size={5}
        labels={({ datum }) => `${datum.label}\n(${datum.x.toFixed(0)}, ${datum.y.toFixed(0)})`}
        labelComponent={<VictoryLabel dy={-10} />}
      />
      <VictoryAxis
        label="Avg. Teleop Points"
        style={{
          axisLabel: { fontSize: 16, padding: 35 },
          grid: { stroke: "#ddd", strokeWidth: 0.5 },
          tickLabels: { fontSize: 10, padding: 5, angle: 0 },
        }}
        tickFormat={(tick) => Number(tick).toFixed(1)}
      />
      <VictoryAxis
        dependentAxis
        label="Avg. Auto + Endgame Points"
        style={{
          axisLabel: { fontSize: 16, padding: 35 },
          grid: { stroke: "#ddd", strokeWidth: 0.5 },
          tickLabels: { fontSize: 10, padding: 5 },
        }}
        tickFormat={(tick) => Number(tick).toFixed(0)}
      />
    </VictoryChart>
  );
};

export default Chart1;
