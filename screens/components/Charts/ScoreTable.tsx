import React from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import { PitModel } from "../../../models/PitModel";
import {
  getAvgTotalPoints,
  getAvgTotalTeleopPoints,
  getAvgTotalAutoPoints,
  getAvgTotalEndGamePoints,
} from "../../../models/StatsCalculations";
import * as XLSX from "xlsx";
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

interface TableProps {
  data: PitModel[];
}

const exportToExcel = async (data: any, fileName: any) => {
  // Create a new workbook and add a new sheet to it
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Write the workbook to a binary string
  const wbout = XLSX.write(wb, { type: 'binary', bookType: "xlsx" });

  // Write the file to the local file system
  const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}.xlsx`;
  await RNFS.writeFile(filePath, wbout, 'ascii');

  // Share or prompt the user to save the file
  Share.open({
    url: `file://${filePath}`,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }).catch((error) => {
    console.error('Error saving the file', error);
  });
};


const ScoreTable: React.FC<TableProps> = ({ data }) => {
  // Sort data based on Avg Total Points in descending order using the matches property
  const sortedData = [...data].sort((a, b) => {
    const avgPointsB = Number(getAvgTotalPoints(b.matches || []));
    const avgPointsA = Number(getAvgTotalPoints(a.matches || []));
    return avgPointsB - avgPointsA;
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>
        Average Points Scored
      </Text>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Team #</Text>
        <Text style={styles.headerCell}>Total</Text>
        <Text style={styles.headerCell}>Teleop</Text>
        <Text style={styles.headerCell}>Auto</Text>
        <Text style={styles.headerCell}>Endgame</Text>
        <Text style={styles.headerCell}>Wight (lbs)</Text>
        <Text style={styles.headerCell}>Drive Base</Text>
      </View>
      {sortedData.map((pit, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{pit.TeamNumber}</Text>
          <Text style={styles.cell}>
            {Number(getAvgTotalPoints(pit.matches || []))}
          </Text>
          <Text style={styles.cell}>
            {Number(getAvgTotalTeleopPoints(pit.matches || []))}
          </Text>
          <Text style={styles.cell}>
            {Number(getAvgTotalAutoPoints(pit.matches || []))}
          </Text>
          <Text style={styles.cell}>
            {Number(getAvgTotalEndGamePoints(pit.matches || []))}
          </Text>
          <Text style={styles.cell}>{pit.WeightLbs}</Text>
          <Text style={styles.cell}>{pit.DriveBaseType}</Text>
        </View>
      ))}
      <View style={styles.container}>
        <Button
          title="Export to Excel"
          onPress={() =>
            exportToExcel(
              sortedData.map((pit) => ({
                "Team #": pit.TeamNumber,
                Total: Number(getAvgTotalPoints(pit.matches || [])),
                Teleop: Number(getAvgTotalTeleopPoints(pit.matches || [])),
                Auto: Number(getAvgTotalAutoPoints(pit.matches || [])),
                Endgame: Number(getAvgTotalEndGamePoints(pit.matches || [])),
                "Weight (lbs)": pit.WeightLbs,
                "Drive Base": pit.DriveBaseType,
              })),
              "score_table_export"
            )
          }
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f0f0f0", // Added a background color for header row for distinction
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
});

export default ScoreTable;
