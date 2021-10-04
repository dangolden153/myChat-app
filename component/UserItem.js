import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { DataStore } from "@aws-amplify/datastore";
import { Auth } from "aws-amplify";
import { User, Chatroom, ChatroomUser } from "../src/models";

const UserItem = ({ user, navigation }) => {
  const { imageUri, name } = user;
  const pics = `${require("../images/food_2.jpg")}`;

  const onpress = async () => {
    // creating a chat room
    const newChatRoom = await DataStore.save(new Chatroom({ newMessages: 0 }));
    console.log("newChatRoom", newChatRoom);
    /// authenticated user connected with a chat room
    const authUser = await Auth.currentAuthenticatedUser();
    const dbUser = await DataStore.query(User, authUser.attributes.sub);
    await DataStore.save(
      new ChatroomUser({
        user: dbUser,
        chatroom: newChatRoom,
      })
    );

    /// clicked/recipient user connected with a chat room
    await DataStore.save(
      new ChatroomUser({
        user,
        chatroom: newChatRoom,
      })
    );

    navigation.navigate("ChatRoomScreen", { id: newChatRoom?.id });
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={onpress}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Image
          source={{ uri: imageUri !== null ? imageUri : pics }}
          style={{ height: 60, width: 60, margin: 20 }}
        />
        <Text>{name}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserItem;
