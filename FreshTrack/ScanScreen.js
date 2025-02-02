import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "./styles"; // Import the shared styles
import { SafeAreaView } from "react-native-safe-area-context";
import API_URL from "./env";



const ScanScreen = () => {
  const [productImage, setProductImage] = useState(null);
  const [expirationImage, setExpirationImage] = useState(null);
  const [productText, setProductText] = useState("");
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generalized image picker function.
  const pickImage = async (setImageFunction, endpoint, setTextFunction) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Media library permission denied");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      base64: true,
    });
    if (!result.canceled) {
      const uri = result.assets ? result.assets[0].uri : result.uri;
      setImageFunction(uri);
      setError(null);
      uploadImage(uri, endpoint, setTextFunction);
    }
  };

  const uploadImage = async (imageUri, endpoint, setTextFunction) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "upload.jpg",
      });
      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (endpoint === "getExpiration") {
        const date = new Date(data.text);
        if (date instanceof Date && !isNaN(date)) {
          date.setDate(date.getDate() + 1);
          setExpirationDate(date);
        }
      } else {
        setTextFunction(data.text || "No text detected");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const submitItem = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productText,
          expiration: expirationDate.toISOString().split("T")[0], // Format the date as yyyy-mm-dd
        }),
      });

      Alert.alert("Item Saved!");
      setProductText("");
      setProductImage(null);
      setExpirationImage(null);
    } catch (err) {
      console.error(err);
      setError("Failed to submit item");
    } finally {
      setLoading(false);
    }
  };

  const onExpirationDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || expirationDate;

    // Check if the selected date is valid
    if (currentDate instanceof Date && !isNaN(currentDate.getTime())) {
      setExpirationDate(currentDate); // Update the state with valid date
    } else {
      console.log("Invalid date selected. Not updating expiration date.");
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Add Item</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              pickImage(setProductImage, "getName", setProductText)
            }
          >
            <Text style={styles.buttonText}>Product Image</Text>
          </TouchableOpacity>
          {productImage && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: productImage }} style={styles.image} />
            </View>
          )}
          <TextInput
            style={styles.textBox}
            value={productText}
            placeholder="Product Name"
            editable={true}
            onChangeText={setProductText}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              pickImage(setExpirationImage, "getExpiration", setExpirationDate)
            }
          >
            <Text style={styles.buttonText}>Expiration Date Image</Text>
          </TouchableOpacity>
          {expirationImage && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: expirationImage }} style={styles.image} />
            </View>
          )}

          <DateTimePicker
            value={expirationDate}
            mode={"date"}
            is24Hour={true}
            display="default"
            style={styles.datePicker}
            onChange={onExpirationDateChange}
          />

          {loading && <ActivityIndicator size="large" color="#007AFF" />}
          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={submitItem}
            disabled={loading || !productText || !expirationDate}
          >
            <Text style={styles.buttonText}>Submit Item</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScanScreen;
