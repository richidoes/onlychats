import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';

export async function requestLocationPermissions() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(
      'Location permission denied',
      'Please enable location for this app in your phone settings',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Go to Settings',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:location');
            }
            if (Platform.OS === 'android') {
              // Open location settings android
              startActivityAsync(ActivityAction.LOCATION_SOURCE_SETTINGS);
            }
          },
          style: 'default',
        },
      ]
    );
    return null;
  }
  const loc = await Location.getCurrentPositionAsync({});
  const { latitude } = loc.coords;
  const { longitude } = loc.coords;

  return {
    latitude,
    longitude,
  };
}
