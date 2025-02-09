import { Text, View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Link } from "expo-router";
import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";


import Scan from "./ScanScreen";
import TypeScreen from "./TypeScreen";






export default function Index() {
  const [screen, setScreen] = useState("home");


  if (screen == "scan") return <Scan goBack={() => setScreen("home")} />
  if (screen == "type") return <TypeScreen goBack={() => setScreen("home")} />
  return (
    <View style={styles.container}>
      <Text style={styles.title}>savor</Text>
      <Text style={styles.subtitle}>scan, cook, savor</Text>


      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setScreen("scan")}>
          <Text style={styles.buttonText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Type Pressed")}>
          <Text style={styles.buttonText}>Type</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E25D5D", // Red background
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
})
