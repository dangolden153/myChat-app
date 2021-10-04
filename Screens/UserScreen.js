import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { mealData } from "../component/data";
import UserItem from "../component/UserItem";
import { User } from "../src/models";
import { DataStore } from "@aws-amplify/datastore";

const UserScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await DataStore.query(User);
      setUsers(fetchedUser);
    };

    fetchUser();
  }, []);

  console.log("users", users);

  const navigation = useNavigation();
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserItem user={item} navigation={navigation} />
        )}
      />
      {/* <Button title="next" onPress={()=>navigation.navigate("")}/> */}
    </View>
  );
};

export default UserScreen;
