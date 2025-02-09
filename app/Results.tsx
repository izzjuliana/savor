import React, { useEffect } from "react";


import { View, Alert, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";


function Results({ labels=[], goBack } : {labels: { description: string}[]; goBack: () => void}) {


    useEffect(() => {
        Alert.alert("Hi!", "Results screen loaded successfully."); // ✅ This will show up correctly
      }, []);
  return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={goBack}>
            <Text>Back</Text>
            </TouchableOpacity>
      <Text style={styles.title}>Detected Ingredients</Text>


      <ScrollView style={styles.resultsContainer}>
      {labels.length > 0 ? (
          <View>
            <Text style={styles.label}>Ingredients:</Text>
            {labels.map((label, index) => (
              <Text key={index} style={styles.outputtext}>{label.description}</Text> // ✅ Added key prop
            ))}
          </View>
        ) : (
          <Text style={styles.outputtext}>No ingredients detected.</Text> // ✅ Handles empty labels
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


export default Results


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  resultsContainer: {
    width: "90%",
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  goBackButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#da5050",
    padding: 5,
    borderRadius: 10,
  },
  goBackText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  outputtext: {
    fontSize: 18,
    marginBottom: 10
  }
});
