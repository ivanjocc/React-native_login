import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HealthDataInputScreen = ({ navigation }: any) => {
  const [heartRate, setHeartRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [oxygenLevel, setOxygenLevel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveHealthData = async () => {
    if (!heartRate || !bloodPressure || !oxygenLevel) {
      Alert.alert("Erreur", "Tous les champs sont obligatoires.");
      return;
    }

    try {
      setLoading(true);
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        Alert.alert("Erreur", "Aucune information utilisateur trouvée.");
        return;
      }

      const user = JSON.parse(storedUser);
      // const response = await fetch("http://127.0.0.1:5001/api/health-data", {
      const response = await fetch("https://clinical-backend-ia-3t0k.onrender.com/api/health-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          heartRate,
          bloodPressure,
          oxygenLevel,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Impossible d'enregistrer les informations.");
      }

      setHeartRate("");
      setBloodPressure("");
      setOxygenLevel("");
      Alert.alert("Succès", "Données enregistrées avec succès.");
      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des données:", error);
      Alert.alert("Erreur", "Impossible d'enregistrer les informations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("HealthChart")}
        style={styles.chartButton}
      >
        <Text style={styles.chartButtonText}>Voir les Graphiques</Text>
      </TouchableOpacity>

      <Text style={styles.headerText}>Entrer les Données de Santé</Text>

      <TextInput
        style={styles.input}
        placeholder="Fréquence Cardiaque (bpm)"
        keyboardType="numeric"
        value={heartRate}
        onChangeText={setHeartRate}
      />

      <TextInput
        style={styles.input}
        placeholder="Tension Artérielle (ex: 120/80)"
        value={bloodPressure}
        onChangeText={setBloodPressure}
      />

      <TextInput
        style={styles.input}
        placeholder="Niveau d'Oxygène (%)"
        keyboardType="numeric"
        value={oxygenLevel}
        onChangeText={setOxygenLevel}
      />

      <TouchableOpacity
        onPress={handleSaveHealthData}
        style={styles.saveButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Enregistrer les Données</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  chartButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  chartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HealthDataInputScreen;
