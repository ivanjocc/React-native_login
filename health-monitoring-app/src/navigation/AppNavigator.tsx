import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import HealthDataInputScreen from "../screens/HealthDataInputScreen";
import HealthChartScreen from "../screens/HealthChartScreen";
import { TouchableOpacity, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

export default function AppNavigator({ navigation }: any) {
  const handleLogout = async (navigation: any) => {
    try {
      await AsyncStorage.removeItem("user");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de se déconnecter.");
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Accueil">
        <Stack.Screen name="Accueil" component={HomeScreen} />
        <Stack.Screen name="Connexion" component={LoginScreen} />
        <Stack.Screen name="Inscription" component={RegisterScreen} />
        <Stack.Screen
          name="Tableau de bord"
          component={DashboardScreen}
          options={({ navigation }) => ({
            title: "Tableau de bord",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => handleLogout(navigation)}
                style={{
                  marginRight: 15,
                  padding: 8,
                  backgroundColor: "#d9534f",
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>
                  Déconnexion
                </Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="Saisie des données de santé" component={HealthDataInputScreen} />
        <Stack.Screen name="Graphique de santé" component={HealthChartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
