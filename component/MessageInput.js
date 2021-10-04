import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Chatroom, Message, User } from "../src/models";
import { Auth } from "aws-amplify";
import { DataStore } from "@aws-amplify/datastore";
import { SimpleLineIcons } from "@expo/vector-icons";

import EmojiSelector from "react-native-emoji-selector";
const MessageInput = ({ chatRoom, messageToReply, removeMessageReply }) => {
  const [messg, setMessg] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const messageToReplyID = messageToReply?.id;
  const sendMessage = async () => {
    const userData = await Auth.currentAuthenticatedUser();

    const newMessage = await DataStore.save(
      new Message({
        content: messg,
        userID: userData.attributes.sub,
        chatroomID: chatRoom?.id,
        status: "SENT",
        replyToMessage: messageToReplyID !== "" && messageToReplyID,
        // messageToReplyID ? replyToMessage:  messageToReply.id : null,
      })
    );

    updateLastMessage(newMessage);
    setMessg("");
    removeMessageReply();
    setIsEmojiOpen(false);
  };

  const updateLastMessage = async (newMessage) => {
    DataStore.save(
      Chatroom.copyOf(chatRoom, (UpdateChataMessg) => {
        UpdateChataMessg.lastlMessage = newMessage;
      })
    );
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "IOS" ? "padding" : "height"}
      keyboardVerticalOffset={100}
      style={{ height: isEmojiOpen ? "50%" : "auto" }}
    >
      {messageToReply && (
        <View
          style={{
            backgroundColor: "#bec0db",
            flexDirection: "row",
            // alignSelf: "stretch",
            alignItems: "center",
            padding: 10,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}>
            {/* <CHatMessages message={messageToReply} /> */}
            <Text> {messageToReply.content}</Text>
          </View>
          <TouchableOpacity onPress={() => removeMessageReply()}>
            <View
              style={{
                height: 30,
                width: 30,
                borderRadius: 100,
                backgroundColor: "black",
              }}
            />
          </TouchableOpacity>
        </View>
      )}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => setIsEmojiOpen((currentState) => !currentState)}
          style={{ marginHorizontal: 10 }}
        >
          <SimpleLineIcons name="emotsmile" size={25} />
        </TouchableOpacity>

        <TextInput
          placeholder="type your message here..."
          value={messg}
          onChangeText={(text) => setMessg(text)}
          style={{ flexGrow: 0.9 }}
        />

        <Button
          style={{ padding: 30, marginHorizontal: 10, borderRadius: 20 }}
          title="send"
          onPress={sendMessage}
        />
      </View>
      {isEmojiOpen && (
        <EmojiSelector
          onEmojiSelected={(emoji) =>
            setMessg((currentMessage) => currentMessage + emoji)
          }
          columns={10}
        />
      )}
      {/* <View style={{ height: 20 }} /> */}
    </KeyboardAvoidingView>
  );
};

export default MessageInput;
