import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchHealthDataByUser } from "../services/api";
import { useFocusEffect } from "@react-navigation/native"; // IMPORTANTE

const DashboardScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        let data = await fetchHealthDataByUser(parsedUser.id);

        data.sort(
          (a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setHealthData(data);
      } else {
        Alert.alert("Erreur", "Aucune information utilisateur trouvée.");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données de santé:", error);
      Alert.alert("Erreur", "Impossible de charger les informations.");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Se ejecuta cuando la pantalla obtiene el foco
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const nextPage = () => {
    if (currentPage < Math.ceil(healthData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : user ? (
        <>
          <Text style={styles.welcomeText}>Bienvenue, {user.name} !</Text>
          <Text style={styles.emailText}>E-mail : {user.email}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("HealthDataInput")}
              style={styles.addDataButton}
            >
              <Text style={styles.addDataButtonText}>
                Ajouter de nouvelles données
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Historique de Santé</Text>
          <FlatList
            data={healthData.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )}
            keyExtractor={(item: any) => item._id}
            renderItem={({ item }: any) => (
              <View style={styles.card}>
                <Text style={styles.cardText}>
                  <Text style={styles.boldText}>Fréquence Cardiaque :</Text>{" "}
                  {item.heartRate} bpm
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.boldText}>Tension Artérielle :</Text>{" "}
                  {item.bloodPressure}
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.boldText}>Niveau d'Oxygène :</Text>{" "}
                  {item.oxygenLevel}%
                </Text>
                <Text style={styles.cardText}>
                  <Text style={styles.boldText}>Date :</Text>{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
            )}
            ListFooterComponent={
              <View style={styles.pagination}>
                <TouchableOpacity
                  onPress={prevPage}
                  disabled={currentPage === 1}
                  style={[
                    styles.pageButton,
                    currentPage === 1 && styles.disabledButton,
                  ]}
                >
                  <Text style={styles.pageButtonText}>Précédent</Text>
                </TouchableOpacity>

                <Text style={styles.pageIndicator}>
                  Page {currentPage} sur{" "}
                  {Math.ceil(healthData.length / itemsPerPage)}
                </Text>

                <TouchableOpacity
                  onPress={nextPage}
                  disabled={
                    currentPage === Math.ceil(healthData.length / itemsPerPage)
                  }
                  style={[
                    styles.pageButton,
                    currentPage ===
                      Math.ceil(healthData.length / itemsPerPage) &&
                      styles.disabledButton,
                  ]}
                >
                  <Text style={styles.pageButtonText}>Suivant</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </>
      ) : (
        <Text style={styles.noDataText}>
          Chargement des informations utilisateur...
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    color: "#555",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: { fontSize: 16, marginBottom: 4 },
  boldText: { fontWeight: "bold" },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  pageButton: {
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 8,
    marginHorizontal: 10,
  },
  disabledButton: { backgroundColor: "#ddd" },
  pageButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  pageIndicator: { fontSize: 16, fontWeight: "bold", color: "#333" },
  buttonContainer: { alignItems: "center", marginBottom: 20 },
  addDataButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: 250,
  },
  addDataButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default DashboardScreen;
