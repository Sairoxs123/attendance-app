import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import Home from "./pages/core/Home"
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler'


const Stack = createStackNavigator()

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [screen, setScreen] = useState("")

  const LoginCheck = async () => {
    //AsyncStorage.clear()
    const value = await AsyncStorage.getItem("logged_in");
    if (value != null) {
      setLoggedIn(true)
      setScreen("Home")
    } else {
      setScreen("Login")
    }
  }

  useEffect(() => {
    LoginCheck()
  }, [])

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={screen}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  )

}

export default App
