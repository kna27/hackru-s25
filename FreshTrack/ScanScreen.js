import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const API_URL = "http://localhost:6000";

const ScanScreen = () => {
  const [productImage, setProductImage] = useState(null);
  const [expirationImage, setExpirationImage] = useState(null);
  const [productText, setProductText] = useState("");
  const [expirationText, setExpirationText] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generalized image picker function.
  const pickImage = async (setImageFunction, endpoint, setTextFunction) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Media library permission denied");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      // For newer versions check for canceled property:
      // quality: 1,
    });
    if (!result.canceled) {
      // For expo SDK v48+ the image uri is in result.assets[0].uri
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
        // Do not set "Content-Type" here – let fetch set it automatically when using FormData.
      });
      

      const data = await response.json();
      setTextFunction(data.text || "No text detected");
    } catch (err) {
      console.error(err);
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => pickImage(setProductImage, "getName", setProductText)}
      >
        <Text style={styles.buttonText}>Upload Product Image</Text>
      </TouchableOpacity>
      {productImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: productImage }} style={styles.image} />
        </View>
      )}
      <TextInput
        style={styles.textBox}
        value={productText}
        placeholder="Product Details"
        editable={true} // Allow user to edit the detected text
        onChangeText={setProductText}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => pickImage(setExpirationImage, "getExpiration", setExpirationText)}
      >
        <Text style={styles.buttonText}>Upload Expiration Date Image</Text>
      </TouchableOpacity>
      {expirationImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: expirationImage }} style={styles.image} />
        </View>
      )}
      <TextInput
        style={styles.textBox}
        value={expirationText}
        placeholder="Expiration Date"
        editable={true} // Allow user to edit the detected text
        onChangeText={setExpirationText}
      />

      {loading && <ActivityIndicator size="large" color="#007AFF" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  textBox: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 10,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginTop: 16,
  },
});

export default ScanScreen;
