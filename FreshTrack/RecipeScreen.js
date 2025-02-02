import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  Text,
} from "react-native";
import Markdown from "react-native-markdown-display";

const API_URL = "http://localhost:6000/getRecipe";

const RecipeScreen = () => {
  const [recipeContent, setRecipeContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, []);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.text();
      setRecipeContent(data.replace(/\n/g, "  \n")); // Ensure newlines are properly rendered in Markdown
    } catch (error) {
      console.error("Error fetching recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Suggestion</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={styles.scrollContainer}>
          <Markdown>{recipeContent}</Markdown>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
    padding: 10,
  },
});

export default RecipeScreen;
