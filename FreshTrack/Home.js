import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { useFocusEffect } from "@react-navigation/native";
import API_URL from "./env";

const HomeScreen = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchItems();
    }, [])
  );

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}/items`);
      const data = await response.json();

      const processedData = data.map((item) => ({
        ...item,
        daysRemaining: calculateDaysRemaining(item.expiration),
      }));

      const sortedData = processedData.sort(
        (a, b) => a.daysRemaining - b.daysRemaining
      );

      setItems(sortedData);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching items:", error);
      setLoading(false);
    }
  };

  const calculateDaysRemaining = (expirationDate) => {
    const today = new Date();
    const expiryDate = new Date(expirationDate);
    const timeDiff = expiryDate - today;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysRemaining >= 0 ? daysRemaining : 0;
  };

  const deleteItem = async (id) => {
    try {
      await fetch(`${API_URL}/items/${id}`, { method: "DELETE" });
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error("❌ Error deleting item:", error);
    }
  };

  const getItemStyle = (daysRemaining) => {
    if (daysRemaining < 1) return styles.item4;
    else if (daysRemaining < 3) return styles.item3;
    else if (daysRemaining < 6) return styles.item2;
    return styles.item1;
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Expiring Soon</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={[styles.item, getItemStyle(item.daysRemaining)]}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDays}>
                    {
                        item.daysRemaining < 1
                        ? "Expired"
                        : item.daysRemaining === 1
                        ? "Expires today!"
                        : `Expires in ${item.daysRemaining} days`
                    }
                  </Text>
                </View>
                <TouchableOpacity onPress={() => deleteItem(item._id)}>
                  <Ionicons name="close-circle" size={24} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
