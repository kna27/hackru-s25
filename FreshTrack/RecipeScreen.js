import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  ScrollView,
  Text,
  SafeAreaView
} from "react-native";
import Markdown from "react-native-markdown-display";
import styles from './styles';
import API_URL from "./env";


const RecipeScreen = () => {
  const [recipeContent, setRecipeContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipe();
  }, []);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`${API_URL}/getRecipe`);
      let data = await response.text();
      data = data.replace(/(?<!\*)\*(?!\*)/g, ""); 
      data = data.replace(/["]/g, ""); 
      data = data.replace(/\\n/g, "\n");
      data = data.replace(/\n/g, "\n\n");
      setRecipeContent(data);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.safeContainer}>
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
    </SafeAreaView>
  );
};

export default RecipeScreen;
