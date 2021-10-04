import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, Image, FlatList } from "react-native";
import { Chatroom, Message, User } from "../src/models";
import { DataStore, SortDirection } from "@aws-amplify/datastore";
import CHatMessages from "../component/Message";
import MessageInput from "../component/MessageInput";
import { useNavigation } from "@react-navigation/native";
import ChatRoomHeaderLeft from "../component/ChatRoomHeader";
import ChatRoomHeaderRight from "../component/ChatRoomHeaderRight";

const ChatRoomScreen = ({ route }) => {
  const [chatRoom, setChatRooms] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageToReply, setMessageToReply] = useState(null);
  const { id, user } = route?.params;
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: false,
      headerLeft: () => <ChatRoomHeaderLeft user={user} />,
      headerRight: () => <ChatRoomHeaderRight user={user} />,
    });
  }, []);
  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [chatRoom]);

  useEffect(() => {
    const subscription = DataStore.observe(Message).subscribe((msg) => {
      // console.log("subscription", msg.model, msg.opType, msg.element);
      if (msg.model === Message && msg.opType === "INSERT") {
        setMessages((existingMessges) => [msg.element, ...existingMessges]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchChatRooms = async () => {
    if (!route?.params?.id) {
      return console.warn("no chat room id");
    }
    const chatRoom = await DataStore.query(Chatroom, route?.params?.id);
    if (!chatRoom) {
      return console.error("couldnt find a chatroom");
    } else {
      setChatRooms(chatRoom);
    }
  };

  const fetchMessages = async () => {
    if (!chatRoom) {
      return;
    }
    const fetchedMessages = await DataStore.query(
      Message,
      (message) => message.chatroomID("eq", chatRoom.id),
      {
        sort: (message) => message.createdAt(SortDirection.DESCENDING),
      }
    );
    setMessages(fetchedMessages);
    // console.log("fetchedMessages", fetchedMessages);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        inverted
        data={messages}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => (
          <CHatMessages
            message={item}
            setMessageToReply={() => setMessageToReply(item)}
          />
        )}
      />
      <MessageInput
        chatRoom={chatRoom}
        removeMessageReply={() => setMessageToReply(null)}
        messageToReply={messageToReply}
      />
    </View>
  );
};

export default ChatRoomScreen;
