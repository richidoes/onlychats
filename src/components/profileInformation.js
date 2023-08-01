import * as React from 'react';
import { View, useColorScheme, StyleSheet, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { bool, func, oneOfType, string } from 'prop-types';
import MyText from './MyText';
import Colors from '../../constants/colors';
import {
  updateUserFirstName,
  updateUserLastName,
  updateUserStatus,
} from '../utils/userOperations';
import { resetFirstName, resetLastName, resetStatus } from '../features/user';

export default function ProfileInformation() {
  const user = useSelector(state => state.user);
  const theme = useColorScheme();
  return (
    <View style={{ paddingBottom: 44 }}>
      <MyText
        type="caption"
        style={{ fontWeight: '600', color: `${Colors[theme].text}40` }}
      >
        INFORMATION
      </MyText>
      <InfoField
        theme={theme}
        label="First Name"
        canEdit
        value={user.firstName}
        handleUpdate={updateUserFirstName}
        handleRedux={resetFirstName}
      />
      <InfoField
        label="Last Name"
        value={user.lastName}
        theme={theme}
        canEdit
        handleUpdate={updateUserLastName}
        handleRedux={resetLastName}
      />
      <InfoField label="Email" value={user.email} theme={theme} />
      <InfoField
        label="Status"
        value={user.status}
        theme={theme}
        canEdit
        handleUpdate={updateUserStatus}
        handleRedux={resetStatus}
      />
    </View>
  );
}

function InfoField({
  label,
  value,
  theme,
  canEdit,
  handleUpdate,
  handleRedux,
}) {
  const { id } = useSelector(state => state.user);
  const [localValue, setLocalValue] = React.useState(value);
  const dispatch = useDispatch();
  return (
    <View
      style={[
        styles.fieldContainer,
        { borderBottomColor: `${Colors[theme].text}80` },
      ]}
    >
      <MyText
        type="caption"
        style={{
          fontWeight: '500',
          color: `${Colors[theme].text}80`,
          paddingRight: 10,
        }}
      >
        {label}
      </MyText>
      <TextInput
        placeholder={label}
        value={localValue}
        onChangeText={canEdit && setLocalValue}
        keyboardType={canEdit ? 'web-search' : 'default'}
        onSubmitEditing={event => {
          canEdit && handleUpdate(id, event.nativeEvent.text);
          canEdit && dispatch(handleRedux(event.nativeEvent.text));
        }}
        style={{ fontWeight: '500', color: Colors[theme].text, flexShrink: 1 }}
      />
    </View>
  );
}

InfoField.propTypes = {
  label: string,
  value: oneOfType([string, bool]),
  theme: string,
  canEdit: bool,
  handleUpdate: func,
  handleRedux: func,
};

const styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 15,
  },
});
