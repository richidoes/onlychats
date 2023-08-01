import * as React from 'react';
import MyInput from './MyInput';
import MyButton from './MyButton';
import MyText from './MyText';
import { AuthContext } from '../Context/AuthContext';

export default function ForgotPassword() {
  const { setAuthState, setEmail, isLoading, handleForgotPassword } =
    React.useContext(AuthContext);

  return (
    <>
      <MyText type="title" style={{ marginBottom: 5 }}>
        Forgot Password
      </MyText>
      <MyText type="caption" style={{ marginBottom: 15 }}>
        Enter your email address and we&apos;ll send you a code to reset your
        password.
      </MyText>
      <MyInput label="Email" onChangeText={setEmail} />
      <MyButton
        title={isLoading ? 'Sending Code...' : 'Send Code'}
        disabled={!!isLoading}
        style={{ marginTop: 20 }}
        onPress={handleForgotPassword}
      />
      <MyButton
        type="secondary"
        title="Back to Login"
        onPress={() => setAuthState('signIn')}
      />
    </>
  );
}
