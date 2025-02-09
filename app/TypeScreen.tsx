import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList } from "react-native";

function TypeScreen() {
  const [ingredients, makeIng] = useState(""); 
  const [ingList, makeIngList] = useState<string[]>([]); 

  const addIngs=() => {
    if (ingredients.trim()) { 
      makeIngList([...ingList, ingredients.trim()]); 
      makeIng(""); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Type Ingredients Here</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter ingredients here..."
        value={ingredients}
        onChangeText={makeIng} 
      />

      <Button title="Add Ingredients" onPress={addIngs} />
      
      <FlatList
        data={ingList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.ingredientItem}>{item}</Text>
        )}
        ListEmptyComponent={<Text style={styles.ingredientsText}>No Ingredients Added</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  ingredientItem: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  ingredientsText: {
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});

export default TypeScreen;