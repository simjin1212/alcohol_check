import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export function MenuView({ children }: any) {
  return (
    <View style={styles.container}>
      <Text>메뉴</Text>
      {/* <Button title="걸음걸이"></Button>
      <Button title="구구단"></Button> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, textAlign: "center", marginRight: 8 },
});
