import 'dotenv/config'
import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Campus Companion',
  slug: 'campus-companion',
  scheme: 'campuscompanion',
  plugins: [
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Allow Campus Companion to use your location to guide you to buildings and classrooms.',
      },
    ],
  ],
  ios: {
    bundleIdentifier: 'com.yourcompany.campuscompanion',
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY,
    },
  },
  android: {
    package: 'com.yourcompany.campuscompanion',
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY,
      },
    },
  },
})