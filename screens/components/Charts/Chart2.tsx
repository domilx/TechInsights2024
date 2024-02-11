import React from 'react';
import { VictoryScatter, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';
import { MatchModel } from '../../../models/MatchModel';
import { getAvgCycleTimeLastFive, getAvgNumTotalNotesFullMatch } from '../../../models/StatsCalculations';

interface ChartProps {
  data: MatchModel[];
}

const Chart2: React.FC<ChartProps> = ({ data }) => {
  const processedData = data.map(match => ({
    x: getAvgCycleTimeLastFive([match]), // Assuming this function calculates the average cycle time for the last 5 matches
    y: getAvgNumTotalNotesFullMatch([match]), // Assuming this calculates the average number of notes scored in the last 5 matches
  }));

  return (
    <VictoryChart theme={VictoryTheme.material}>
      <VictoryScatter data={processedData}/>
      <VictoryAxis label="Avg. Cycle Times (s)"/>
      <VictoryAxis dependentAxis label="Avg # Notes Scored"/>
    </VictoryChart>
  );
};

export default Chart2;
