import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import HomeScreen from "./Screens/HomeScreen";
import UserScreen from "./Screens/UserScreen";
import ChatRoomScreen from "./Screens/ChatRoomScreen";

const Navigation = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="UserScreen" component={UserScreen} />
        <Stack.Screen
          name="ChatRoomScreen"
          component={ChatRoomScreen}
          // options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    // <View>
    //     <Text>
    //         lol
    //     </Text>
    // </View>
  );
};

export default Navigation;
