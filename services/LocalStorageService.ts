import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveDataLocally = async (key: string, data: any) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
    return { success: true, message: "Data saved locally." };
  } catch (e) {
    console.error("Error saving data locally: ", e);
    return { success: false, message: "Failed to save data locally." };
  }
};

export const getDataLocally = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error getting data locally: ", e);
    return null;
  }
};

export const removeDataLocally = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
    return { success: true, message: "Data removed locally." };
  } catch (e) {
    console.error("Error removing data locally: ", e);
    return { success: false, message: "Failed to remove data locally." };
  }
};