import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import { Chatroom, Message, User } from "../src/models";
import { DataStore } from "@aws-amplify/datastore";
import { Auth } from "aws-amplify";
import { Ionicons } from "@expo/vector-icons";
import MessgReplyTo from "./MessgReplyTo";

const CHatMessages = (props) => {
  const { setMessageToReply, message: propMessage } = props;
  const [isMe, setIsMe] = useState(null);
  const [message, setMessages] = useState(propMessage);
  const [user, setUser] = useState(undefined);
  const [messgReplyTo, setMessgReplyTo] = useState(undefined);

  useEffect(() => {
    DataStore.query(User, message?.userID).then(setUser);
  }, []);

  useEffect(() => {
    if (message.replyToMessage) {
      DataStore.query(Message, message.replyToMessage).then(setMessgReplyTo);
    }
  }, [message]);

  //// to update each repliedTo message
  useEffect(() => {
    setMessages(propMessage);
  }, [propMessage]);

  useEffect(() => {
    const checkIsMe = async () => {
      if (!user) {
        return;
      }
      const userData = await Auth.currentAuthenticatedUser();

      setIsMe(user?.id === userData.attributes.sub);
    };

    checkIsMe();
  }, [user]);

  useEffect(() => {
    const subscription = DataStore.observe(Message, message?.id).subscribe(
      (msg) => {
        // console.log("subscription", msg.model, msg.opType, msg.element);
        if (msg.model === Message && msg.opType === "UPDATE") {
          setMessages((message) => ({ ...message, ...msg.element }));
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [message]);

  useEffect(() => {
    setAsRead();
  }, [isMe]);

  const setAsRead = async () => {
    if (isMe === false && message?.status !== "READ") {
      await DataStore.save(
        Message.copyOf(message, (updateStatus) => {
          updateStatus.status = "READ";
        })
      );
    }
  };

  return (
    <Pressable
      onLongPress={setMessageToReply}
      style={[
        {
          flex: 1,
          alignSelf: isMe ? "flex-end" : "flex-start",

          backgroundColor: isMe ? "#3f7fe6f3" : "#059669",
        },
        styles.container,
      ]}
    >
      {messgReplyTo && <MessgReplyTo message={messgReplyTo} />}
      {/* {messgReplyTo && (
        <Text style={{ flex: 1, color: "white", padding: 10 }}>
          {messgReplyTo.content}
        </Text>
      )} */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignSelf: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: "white",
          }}
        >
          {message?.content}
        </Text>
        {isMe && !!message?.status && message?.status !== "SENT" && (
          <Ionicons
            name={
              message?.status === "DELIVERED" ? "checkmark" : "checkmark-done"
            }
            size={15}
            color={message?.status === "DELIVERED" ? "white" : "#eb5545"}
            style={{ marginLeft: 7 }}
          />
        )}
      </View>
    </Pressable>
  );
};

export default CHatMessages;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    maxWidth: "70%",
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
  },
});
