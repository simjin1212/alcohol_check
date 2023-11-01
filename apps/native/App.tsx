import * as Permissions from "expo-permissions";
import { StyleSheet, View } from "react-native";

import React from "react";
import { LoadingView } from "./src/LoadingView";
import { useTensorFlowLoaded } from "./src/useTensorFlow";
import { ModelView } from "./src/ModelView";
export default function App() {
  const isLoaded = useTensorFlowLoaded();
  const [status] = Permissions.usePermissions(Permissions.CAMERA, {
    ask: true,
  });
  if (!(status || {}).granted) {
    return <LoadingView>Camera permission is required to continue</LoadingView>;
  }
  if (!isLoaded) {
    return <LoadingView>Loading TensorFlow</LoadingView>;
  }
  return (
    <View style={styles.container}>
      <ModelView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontWeight: "bold",
    // marginBottom: 20,
    fontSize: 36,
  },
});
