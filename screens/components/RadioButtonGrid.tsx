import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface RadioButtonGridProps {
  horizontalAmount: any;
  verticalAmount: any;
  columnTitles: any;
  rowTitles: any;
  label: string;
  onPress: (values: string[]) => void;
  saveButtons: (selectedButtons: number[]) => void;
  value: any;
}

export const RadioButtonGrid: React.FC<RadioButtonGridProps> = ({
  horizontalAmount,
  verticalAmount,
  columnTitles,
  label,
  onPress,
  saveButtons,
  value,
}) => {
  const [selectedButtons, setSelectedButtons] = useState<number[]>(value);

  const generateButtons = () => {
    const buttons: JSX.Element[] = [];
    for (let i = 0; i < verticalAmount; i++) {
      const row: JSX.Element[] = [];
      for (let j = 0; j < horizontalAmount; j++) {
        const index = i * horizontalAmount + j;
        row.push(
          <View key={index} style={{ marginRight: 20, marginLeft: 20 }}>
            <TouchableOpacity
              onPress={() => {
                const index = i * horizontalAmount + j;
                const isSelected = selectedButtons.includes(index);
                let newSelectedButtons: number[];

                if (isSelected) {
                  newSelectedButtons = selectedButtons.filter(
                    (item) => item !== index
                  );
                } else {
                  newSelectedButtons = [...selectedButtons, index];
                }

                setSelectedButtons(newSelectedButtons);
                saveButtons(newSelectedButtons); // Save the selected buttons
                console.log(newSelectedButtons);

                let valuesToSave: string[] = [];
                if (newSelectedButtons.includes(0)) {
                  valuesToSave = [...valuesToSave, "Starting Zone"];
                }
                if (newSelectedButtons.includes(1)) {
                  valuesToSave = [...valuesToSave, "Podium"];
                }
                if (newSelectedButtons.includes(2)) {
                  valuesToSave = [...valuesToSave, "Elsewhere in Wing"];
                }
                if (newSelectedButtons.includes(3)) {
                  valuesToSave = [...valuesToSave, "Near Centre Line"];
                }
                if (valuesToSave.length === 0) {
                  valuesToSave = ["None"];
                }
                onPress(valuesToSave);
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ marginRight: 5 }}>
                  {selectedButtons.includes(index) ? (
                    <Icon name="radio-button-on" size={32} color="#333" />
                  ) : (
                    <Icon name="radio-button-off" size={32} color="#333" />
                  )}
                </View>
                <Text>{/* Text for the button */}</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      }
      buttons.push(
        <View key={i} style={styles.rowContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {row}
          </View>
        </View>
      );
    }
    return buttons;
  };

  const renderColumnTitles = () => {
    return (
      <View style={styles.columnTitleContainer}>
        {columnTitles.map((title: any, index: any) => (
          <Text key={index} style={styles.columnTitle}>
            {title}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.subViews}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.counterContainer}>
        {renderColumnTitles()}
        {generateButtons()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subViews: {
    width: "90%",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 10,
    marginLeft: "5%",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    color: "#555",
    alignSelf: "flex-start",
  },
  rowTitle: {
    marginRight: "12%",
  },
  counterContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 15,
    padding: 10,
    borderColor: "#A0A0A0",
    borderWidth: 1,
  },
  columnTitleContainer: {
    flexDirection: "row",
    marginBottom: 10,
    marginLeft: "2%",
  },
  columnTitle: {
    justifyContent: "flex-end",
    marginRight: 10,
    marginLeft: 10,
    fontWeight: "bold",
  },
});
