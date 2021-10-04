import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Chatroom, ChatroomUser, Message } from "../src/models";
import { DataStore } from "@aws-amplify/datastore";
import { Auth } from "aws-amplify";

const HomeScreenItem = ({ chatRoom, navigation }) => {
  //   const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    /// fetching the users that the navigated chatRoom contain.....
    const fetchUsers = async () => {
      const fetchedUsers = (await DataStore.query(ChatroomUser))
        .filter((ChatroomUser) => ChatroomUser?.chatroom?.id === chatRoom?.id)
        .map((ChatroomUser) => ChatroomUser?.user);
      //   setUsers(fetchedUsers);

      const authUser = await Auth.currentAuthenticatedUser();

      setUser(
        fetchedUsers.find(
          (user) => user?.id !== authUser?.attributes?.sub || null
        )
      );
      // console.log("fetchedUsers", fetchedUsers);
    };

    fetchUsers();
  }, []);

  // console.log("chatRoom", chatRoom);

  const onPress = () => {
    if (!user) {
      return <ActivityIndicator />;
    }
    console.log("press on", user);
    navigation.navigate("ChatRoomScreen", { user, id: chatRoom?.id });
  };

  useEffect(() => {
    if (!chatRoom) {
      return console.log("last messg in the chat room not available");
    }

    DataStore.query(Message, chatRoom?.chatroomLastlMessageId).then(
      setLastMessage
    );
  }, []);

  // console.log("lastMesssage", lastMessage);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Text>{user?.name}</Text>
        <Text>{lastMessage?.content}</Text>
        <Text>{lastMessage?.createdAt}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreenItem;

const styles = StyleSheet.create({
  container: {
    marginVertical: 7,
    backgroundColor: "#bec0db",
    padding: 10,
  },
});
