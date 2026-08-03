import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="connect-device" />
      <Stack.Screen name="device-connected" />
    </Stack>
  );
}
