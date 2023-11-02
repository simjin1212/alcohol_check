import { StyleSheet } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";

import { MenuView } from "./src/MenuView";
import { ModelView } from "./src/ModelView";

const Tab = createBottomTabNavigator();

export default function App() {
  // if (!(status || {}).granted) {
  //   return <LoadingView>Camera permission is required to continue</LoadingView>;
  // }
  // if (!isLoaded) {
  //   return <LoadingView>Loading TensorFlow</LoadingView>;
  // }
  // return (
  //   <View style={styles.container}>
  //     {/* <Text style={styles.header}>Native</Text>
  //     <Button
  //       onClick={() => {
  //         console.log("hello World");
  //         alert("hello World");
  //       }}
  //       text="Boop"
  //     />
  //     <StatusBar style="auto" /> */}
  //     <MenuView />
  //     <ModelView />
  //   </View>
  // );
  return (
    // <View style={styles.container}>
    //   <ModelView />
    // </View>
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={MenuView} />
        <Tab.Screen name="TensorFlow" component={ModelView} />

        {/* TODO */}
        {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
      </Tab.Navigator>
    </NavigationContainer>
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
