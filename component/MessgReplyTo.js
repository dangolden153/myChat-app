import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import { Chatroom, Message, User } from "../src/models";
import { DataStore } from "@aws-amplify/datastore";
import { Auth } from "aws-amplify";
import { Ionicons } from "@expo/vector-icons";

const MessgReplyTo = (props) => {
  const { message: propMessage } = props;
  const [isMe, setIsMe] = useState(null);
  const [message, setMessages] = useState(propMessage);
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    DataStore.query(User, message?.userID).then(setUser);
  }, []);

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

  //   useEffect(() => {
  //     setAsRead();
  //   }, [isMe, message]);

  //   const setAsRead = () => {
  //     if (isMe === false && message.status !== "READ") {
  //       DataStore.save(
  //         Message.copyOf(message, (updateStatus) => {
  //           updateStatus.status = "READ";
  //         })
  //       );
  //     }
  //   };
  return (
    <View
      style={{
        flex: 1,
        // width: "100%",
        alignSelf: "flex-end",
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
        backgroundColor: "gray",
        maxWidth: "70%",
        // flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
      //   style={{}}
      >
        <Text
          style={{
            color: "white",
          }}
        >
          {message?.content}
        </Text>
      </View>
    </View>
  );
};

export default MessgReplyTo;

// const styles = StyleSheet.create({

// })
