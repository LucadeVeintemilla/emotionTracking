import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

const MainScreen = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return <Redirect href={"/(tabs)"} />;
  else return <Redirect href={"/login"} />;
};

export default MainScreen;