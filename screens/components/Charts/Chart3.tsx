import React from 'react';
import { VictoryScatter, VictoryChart, VictoryTheme, VictoryAxis, VictoryLabel } from 'victory-native';
import { MatchModel } from '../../../models/MatchModel';
import { getAvgAutoNotesSpeaker, getAvgTeleopNotesAmp, getAvgTeleopNotesAmplifiedSpeaker, getAvgTeleopNotesSpeaker } from '../../../models/StatsCalculations';
import { PitModel } from '../../../models/PitModel';
import { Text } from 'react-native';

interface ChartProps {
  data: PitModel[];
}

const Chart3: React.FC<ChartProps> = ({ data }) => {  
  if (data.length === 0) {
    return <Text>No sufficient data for visualization.</Text>;
  }

  const processedData = data.map((pit) => {
    // Calculate averages for the last five matches for each team
    const lastFiveMatches = pit.matches?.slice(-5) ?? []; // Add nullish coalescing operator
    const AvgTeleopNotesAmp = getAvgTeleopNotesAmp(lastFiveMatches);
    const AvgTeleopNotesSpeaker = getAvgTeleopNotesSpeaker(lastFiveMatches);

    return {
      x: AvgTeleopNotesAmp,
      y: AvgTeleopNotesSpeaker,
      label: `#${pit.TeamNumber}`
    };
  });

  return (
    <>
    <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Avg Teleop Notes in Amplifier vs. Speaker</Text>
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
        label="Amplifier"
        style={{
          axisLabel: { fontSize: 16, padding: 35 },
          grid: { stroke: "#ddd", strokeWidth: 0.5 },
          tickLabels: { fontSize: 10, padding: 5, angle: 0 },
        }}
        tickFormat={(tick) => Number(tick).toFixed(0)}
      />
      <VictoryAxis
        dependentAxis
        label="Speaker"
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

export default Chart3;
