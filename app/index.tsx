import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createStackNavigator, StackNavigationProp } from "@react-navigation/stack";
import TypeScreen from "./TypeScreen";
import ScanScreen from "./ScanScreen"; 

type RootStackParamList = {
  Home: undefined;
  Scan: undefined;
  Type: undefined;
};

interface HomeScreenProps {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
}

const Stack = createStackNavigator<RootStackParamList>();

function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Savor</Text>
      <Text style={styles.subtitle}>Scan, cook, savor</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Scan")}
        >
          <Text style={styles.buttonText}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Type")}
        >
          <Text style={styles.buttonText}>Type</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function Index() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Scan">
        {(props) => <ScanScreen {...props} goBack={props.navigation.goBack} />}
      </Stack.Screen>
      <Stack.Screen name="Type" component={TypeScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E25D5D",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    fontFamily: "serif",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
