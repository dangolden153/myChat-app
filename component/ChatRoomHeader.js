import React from "react";
import {
  View,
  Image,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import momemt from "moment";

const ChatRoomHeaderLeft = ({ user }) => {
  const momentTime = momemt().diff(user?.lastOnlineAt);
  //   console.log(momentTime)
  const lastSeen = `Last seen ${momemt(user?.lastOnlineAt).format("LT")}`;

  ///if the current time in seconds is less than 5sec,online status should be
  //// displayed else the current time should be display
  const userStatus = momentTime < 5 * 60 * 1000 ? "online" : lastSeen;

  const navigation = useNavigation();

  const pic =
    "https://icon-library.com/images/unknown-person-icon/unknown-person-icon-4.jpg";

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity>
        <AntDesign
          name="arrowleft"
          size={20}
          color="black"
          onPress={() => navigation.goBack()}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`flex-row w-48  px-3`}
        // onPress={() => navigation.navigate("ProfileScreen")}
      >
        <Image
          source={{ uri: user?.imageUri ? user?.imageUri : pic }}
          //   source={{ uri: pic }}
          style={{ height: 40, width: 40, borderRadius: 100 }}
        />

        <View style={{ marginLeft: 10 }}>
          <Text
            numberOfLines={1}
            style={{
              width: "90%",
              fontSize: 16,
              color: "black",
            }}
          >
            {user?.name}
          </Text>
          <Text style={[tw` text-sm`, { color: "#bec0db" }]}>{userStatus}</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChatRoomHeaderLeft;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
  },
});
