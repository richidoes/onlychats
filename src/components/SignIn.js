import * as React from 'react';
import { Pressable } from 'react-native';
import MyInput from './MyInput';
import MyButton from './MyButton';
import MyText from './MyText';
import { AuthContext } from '../Context/AuthContext';
import Colors from '../../constants/colors';

export default function SignIn() {
  const { setAuthState, setEmail, setPassword, handleSignIn, isLoading } =
    React.useContext(AuthContext);

  return (
    <>
      <MyText type="title" style={{ marginBottom: 30 }}>
        Login
      </MyText>
      <MyInput label="Email" onChangeText={setEmail} />
      <MyInput label="Password" onChangeText={setPassword} secureTextEntry />
      <Pressable onPress={() => setAuthState('forgotPassword')}>
        <MyText
          style={{
            color: Colors.light.tint,
            position: 'absolute',
            right: 0,
            top: -15,
          }}
          type="caption"
        >
          Forgot Password?
        </MyText>
      </Pressable>
      <MyButton
        title={isLoading ? 'loading...' : 'Sign In'}
        disabled={!!isLoading}
        onPress={handleSignIn}
        style={{ marginTop: 20 }}
      />
      <MyButton
        title="Go Back"
        type="secondary"
        onPress={() => setAuthState('default')}
      />
    </>
  );
}
