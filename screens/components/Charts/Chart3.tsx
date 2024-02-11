import React from 'react';
import { VictoryScatter, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';
import { MatchModel } from '../../../models/MatchModel';
import { getAvgAutoNotesSpeaker, getAvgTeleopNotesAmplifiedSpeaker } from '../../../models/StatsCalculations';

interface ChartProps {
  data: MatchModel[];
}

const Chart3: React.FC<ChartProps> = ({ data }) => {
  const processedData = data.map(match => ({
    x: getAvgAutoNotesSpeaker([match]), // Assuming calculates avg. auto notes in speaker for the last 5 matches
    y: getAvgTeleopNotesAmplifiedSpeaker([match]), // Assuming calculates avg. teleop notes in amplifier for the last 5 matches
  }));

  return (
    <VictoryChart theme={VictoryTheme.material}>
      <VictoryScatter data={processedData}/>
      <VictoryAxis label="Avg Auto Notes in Speaker"/>
      <VictoryAxis dependentAxis label="Avg Teleop Notes in Amplifier"/>
    </VictoryChart>
  );
};

export default Chart3;
