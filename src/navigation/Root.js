import * as React from "react";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Onboarding from "../screens/Onboarding";
import { Ionicons } from "@expo/vector-icons";
import Chats from "../screens/Chats";
import NewPost from "../screens/NewPost";
import ChatRoom from "../screens/ChatRoom";
import ContactProfile from "../screens/ContactProfile";
import NewChat from "../screens/NewChat";
import NotificationsScreen from "../screens/NotificationsScreen";
import ShowPost from "../screens/ShowPost";
import { useSelector } from "react-redux";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function Root({ colorScheme }) {
  return (
    <NavigationContainer
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <BottomNavigation />
    </NavigationContainer>
  );
}

function BottomNavigation() {
  const { notifications } = useSelector((state) => state.notifications);
  const unSeenNotifications = notifications.map((not) => not.isSeen === false);
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-home" color={color} />
          ),
          headerShown: false,
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="ChatsStack"
        component={ChatsStack}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="md-chatbubbles" color={color} />
          ),
          headerShown: false,
          tabBarLabel: "Chats",
        }}
      />
      <Tab.Screen
        name="NotificationsStack"
        component={NotificationsStack}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-notifications" color={color} />
          ),
          headerShown: false,
          tabBarLabel: "Notifications",
          tabBarBadge: unSeenNotifications.length,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="person-circle" color={color} />
          ),
          tabBarLabel: "Settings",
        }}
      />
    </Tab.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="NewPost"
        component={NewPost}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen name="ShowPost" component={ShowPost} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
    </Stack.Navigator>
  );
}

function ChatsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chats"
        component={Chats}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
      <Stack.Screen
        name="NewChat"
        component={NewChat}
        options={{
          presentation: "modal",
          headerTitle: "New Chat",
        }}
      />
      <Stack.Screen
        name="ContactProfile"
        component={ContactProfile}
        options={{ presentation: "modal", headerTitle: "Contact Info" }}
      />
    </Stack.Navigator>
  );
}

function NotificationsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
      <Stack.Screen name="ShowPost" component={ShowPost} />
      <Stack.Screen
        name="ContactProfile"
        component={ContactProfile}
        options={{ presentation: "modal", headerTitle: "Contact Info" }}
      />
    </Stack.Navigator>
  );
}

function TabBarIcon(props) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}
