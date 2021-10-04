import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Chatroom, ChatroomUser, Message } from "../src/models";
import { DataStore } from "@aws-amplify/datastore";
import { Auth } from "aws-amplify";
import HomeScreenItem from "../component/HomeScreenItem";

const HomeScreen = () => {
  const [chatRoom, setChatRoom] = useState([]);

  const navigation = useNavigation();
  useEffect(() => {
    const fetchChatRooms = async () => {
      const userData = await Auth.currentAuthenticatedUser();

      const fetchedChatRooms = (await DataStore.query(ChatroomUser))
        .filter(
          (chatRoomUser) => chatRoomUser.user.id === userData.attributes.sub
        )
        .map((chatRoomUser) => chatRoomUser.chatroom);
      // console.log("ChatroomUser", fetchedChatRooms);
      setChatRoom(fetchedChatRooms);
    };

    fetchChatRooms();
  }, []);

  return (
    <View style={{ flex: 1, paddingVertical: 20 }}>
      <Text>HomeScreen</Text>
      <FlatList
        data={chatRoom}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <HomeScreenItem chatRoom={item} navigation={navigation} />
        )}
      />
      <Button title="next" onPress={() => navigation.navigate("UserScreen")} />
    </View>
  );
};

export default HomeScreen;
