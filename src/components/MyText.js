import * as React from 'react';
import { Text, StyleSheet, useColorScheme } from 'react-native';
import { arrayOf, object, oneOfType, string } from 'prop-types';
import Colors from '../../constants/colors';

export default function MyText({ children, type = 'body', style }) {
  const theme = useColorScheme();
  return (
    <Text style={[styles[type], { color: Colors[theme].text }, style]}>
      {children}
    </Text>
  );
}

MyText.propTypes = {
  type: string,
  style: oneOfType([object, arrayOf(object)]),
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 18,
  },
  caption: {
    fontSize: 14,
  },
});
