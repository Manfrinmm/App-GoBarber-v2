import "react-native-gesture-handler";
import React from "react";
import { View, YellowBox, StatusBar } from "react-native";

import { NavigationContainer } from "@react-navigation/native";

import AppProvider from "./hooks";
import Routes from "./routes";

const App: React.FC = () => {
  YellowBox.ignoreWarnings(["Failed prop type: Invalid prop `color`"]);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#312e38" barStyle="light-content" />
      <AppProvider>
        <View style={{ backgroundColor: "#312e38", flex: 1 }}>
          <Routes />
        </View>
      </AppProvider>
    </NavigationContainer>
  );
};

export default App;
