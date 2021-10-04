import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import tw from "tailwind-react-native-classnames";

const ChatRoomHeaderRight = () => {
  return (
    <View style={tw` flex-row `}>
      <TouchableOpacity
        style={{
          backgroundColor: "#059669",
          alignItems: "center",
          padding: 10,
          borderRadius: 5,
          marginHorizontal: 15,
        }}
        //   onPress={() => navigation.navigate("VideoCallScreen")}
      >
        <Ionicons name="call" size={15} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "#005CEE",
          alignItems: "center",
          padding: 10,
          borderRadius: 5,
          marginRight: 20,
        }}
      >
        <FontAwesome5 name="video" size={15} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatRoomHeaderRight;
