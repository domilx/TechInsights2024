import React from 'react';
import { VictoryScatter, VictoryChart, VictoryTheme, VictoryAxis, VictoryLabel } from 'victory-native';
import { MatchModel } from '../../../models/MatchModel';
import { getAvgCycleTimeLastFive, getAvgNumTotalNotesFullMatch } from '../../../models/StatsCalculations';
import { PitModel } from '../../../models/PitModel';
import { Text } from 'react-native';

interface ChartProps {
  data: PitModel[];
}

const Chart2: React.FC<ChartProps> = ({ data }) => {
  const processedData = data.map((pit) => {
    // Calculate averages for the last five matches for each team
    const lastFiveMatches = pit.matches?.slice(-5) ?? []; // Add nullish coalescing operator
    const AvgCycleTimeLastFive = Number(getAvgCycleTimeLastFive(lastFiveMatches));
    const AvgNumTotalNotesFullMatch = Number(getAvgNumTotalNotesFullMatch(lastFiveMatches));

    return {
      x: AvgCycleTimeLastFive,
      y: AvgNumTotalNotesFullMatch,
      label: `#${pit.TeamNumber}`
    };
  });

  return (
    <>
    <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Cycle Time vs. Total Notes</Text>
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
        label="Avg. Cycle Times (s)"
        style={{
          axisLabel: { fontSize: 16, padding: 35 },
          grid: { stroke: "#ddd", strokeWidth: 0.5 },
          tickLabels: { fontSize: 10, padding: 5, angle: 0 },
        }}
        tickFormat={(tick) => Number(tick).toFixed(0)}
      />
      <VictoryAxis
        dependentAxis
        label="Avg # Notes Scored"
        style={{
          axisLabel: { fontSize: 16, padding: 35 },
          grid: { stroke: "#ddd", strokeWidth: 0.5 },
          tickLabels: { fontSize: 10, padding: 5 },
        }}
        tickFormat={(tick) => Number(tick).toFixed(0)}
      />
    </VictoryChart>
    </>
  );
};

export default Chart2;
