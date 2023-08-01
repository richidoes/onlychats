import * as React from 'react';
import { useColorScheme, View as DefaultView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { object } from 'prop-types';
import Colors from '../../constants/colors';

export function ThemedView({ style, ...otherProps }) {
  const theme = useColorScheme();

  return (
    <DefaultView
      style={[
        { backgroundColor: Colors[theme].background, paddingHorizontal: 18 },
        style,
      ]}
      {...otherProps}
    />
  );
}

ThemedView.propTypes = {
  style: object,
};

export function ThemedScrollView({ style, children, ...otherProps }) {
  const theme = useColorScheme();

  return (
    <KeyboardAwareScrollView
      style={[
        { backgroundColor: Colors[theme].background, paddingHorizontal: 18 },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}

ThemedScrollView.propTypes = {
  style: object,
};
