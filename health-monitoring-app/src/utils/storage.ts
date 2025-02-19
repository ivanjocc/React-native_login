import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (cle: string, valeur: string) => {
  try {
    await AsyncStorage.setItem(cle, valeur);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement des données :", error);
  }
};

export const getData = async (cle: string) => {
  try {
    return await AsyncStorage.getItem(cle);
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
};
