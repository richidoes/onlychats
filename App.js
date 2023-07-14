import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Amplify, Auth, Hub } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import Root from './src/navigation/Root';
import Splash from './src/screens/Splash';
import AuthScreen from './src/screens/Auth';

Amplify.configure(awsconfig);

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme();

  const listener = data => {
    switch (data.payload.event) {
      case 'signIn':
        const { attributes } = data.payload.data;
        setUser(attributes);
        console.log("user signed in from Hub");
        break;
      case 'signOut':
        setUser(null);
        console.log("user signed out");
        break;
      default:
        break;
    }
  }

  Hub.listen("auth", listener);

  if (isLoading) {
    return <Splash setUser={setUser} setIsLoading={setIsLoading} />
  }

  return user ? <Root colorScheme={colorScheme} /> : <AuthScreen />;
}
