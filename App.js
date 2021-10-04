import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";

import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";

import { withAuthenticator } from "aws-amplify-react-native";
import Amplify, { Auth, Hub, DataStore } from "aws-amplify";
import config from "./src/aws-exports";
import Navigation from "./Navigation";
import { Message, User } from "./src/models";
// import moment from 'moment'
// import UserScreen from "./Screens/UserScreen";
Amplify.configure(config);

function App() {
  const [user, setUser] = useState(null);
  const logout = () => {
    Auth.signOut();
  };

  useEffect(() => {
    // Create listener
    const listener = Hub.listen("datastore", async (hubData) => {
      const { event, data } = hubData.payload;

      if (event === "networkStatus") {
        // console.log(`User has a network connection: ${data.active}`);
      }

      if (
        event === "outboxMutationProcessed" &&
        data.model === Message &&
        !["DELIVERED", "READ"].includes(data.element.status)
      ) {
        DataStore.save(
          Message.copyOf(
            data.element,
            (update) => (update.status = "DELIVERED")
          )
        );
      }
    });
    // Remove listener
    return () => listener();
  }, []);

  /// update user last online
  useEffect(() => {
    const fetchUser = async () => {
      const authUser = await Auth.currentAuthenticatedUser();
      await DataStore.query(User, authUser.attributes.sub).then(setUser);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    const subscription = DataStore.observe(User, user.id).subscribe((msg) => {
      // console.log("subscription", msg.model, msg.opType, msg.element);
      if (msg.model === User && msg.opType === "UPDATE") {
        setUser(msg.element);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateLastOnline();
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const updateLastOnline = async () => {
    if (!user) {
      return;
    }

    const date = new Date();
    const response = await DataStore.save(
      User.copyOf(user, (updated) => {
        // updated.lastOnlineAt = moment().seconds()
        updated.lastOnlineAt = +date;
      })
    );
    setUser(response);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navigation />
      {/* <UserScreen /> */}
      {/* <Text>hey rtyuio</Text> */}
      {/* <Pressable onPress={logout} style={{ color: "green", marginTop: 20 }}>
        <Text>Logout</Text>
      </Pressable> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default withAuthenticator(App);

/// reply message .../
/// last seen  ..../
/// chat room header ../
/// send emoji  ....
/// send image
/// send audio
