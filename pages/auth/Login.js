import React from 'react'
import { useState } from 'react'
import axios from "axios"
import { Text, View, Button, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage"

const Login = ({ navigation }) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const login = async () => {

    if (email == "" || password == "") {
      setMessage("Form was not filled completely.")
    } else {
      const response = await axios.get(
        `https://saiteja123.pythonanywhere.com/account/mobile/login/?email=${email}&password=${password}`
      ).then(
        res => {
          if (res.data.message == true) {
            AsyncStorage.setItem("logged_in", "true")
            if (res.data.teaches) {
              AsyncStorage.setItem("type", "true")
              AsyncStorage.setItem("teaches", res.data.teaches)
            } else {
              AsyncStorage.setItem("type", "false")
            }

            AsyncStorage.setItem("name", res.data.name)
            AsyncStorage.setItem("email", res.data.email)
            navigation.replace("Home")

          } else {
            setMessage(res.data.message)
          }
        }
      )
    }

  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="Enter email: " value={email} onChangeText={setEmail} />
      <TextInput placeholder="Enter password: " secureTextEntry={true} value={password} onChangeText={setPassword} />
      <Text>
        {message}
      </Text>
      <Button title="Login" onPress={login} />
      <View style={{ flexDirection: 'row' }}>
        <Text>
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.replace("Signup")} style={{ marginLeft: 5 }}>
          <Text style={{ textDecorationLine: 'underline' }}>
            Click here
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default Login