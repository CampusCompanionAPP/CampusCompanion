import { Stack } from "expo-router";

export default function AuthRoutesLayout() {
  // const { isSignedIn } = useAuth()

  // if (true) {
  //   return <Redirect href={"/"} />;
  // }

  return <Stack screenOptions={{ headerShown: false }} />;
}
