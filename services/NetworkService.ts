import NetInfo from "@react-native-community/netinfo";

export const checkInternetConnection = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};