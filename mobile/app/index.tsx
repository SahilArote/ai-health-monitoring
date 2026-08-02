import { Redirect, Href } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';

export default function Index() {
  const { isAuthenticated, isOnboarded } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href={"/(auth)/welcome" as Href} />;
  }

  if (!isOnboarded) {
    return <Redirect href={"/(onboarding)/connect-device" as Href} />;
  }

  return <Redirect href={"/(tabs)" as Href} />;
}
