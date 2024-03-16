import React from 'react'
import { useState } from 'react'
import axios from "axios"
import { Text, View, Button, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup = ({ navigation }) => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [type, setType] = useState(false)
  const [ct, setCt] = useState("")
  const [message, setMessage] = useState("")

  const display = type ? "flex" : "none"

  const signup = async () => {

    if (name == "" || email == "" || password == "") {
      setMessage("Form was not filled completely.")
    } else {
      const request = await axios.get(`
      https://saiteja123.pythonanywhere.com/account/mobile/signup/?name=${name}&email=${email}&password=${password}&type=${type}&class=${ct}
      `).then(
        res => {
          if (res.data.message == true) {
            AsyncStorage.setItem("logged_in", "true")
            AsyncStorage.setItem("type", type ? "true" : "false")
            AsyncStorage.setItem("name", name)
            if (type) AsyncStorage.setItem("teaches", ct)
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
      <TextInput placeholder="Enter name: " value={name} onChangeText={setName} />
      <TextInput placeholder="Enter email: " value={email} onChangeText={setEmail} />
      <TextInput placeholder="Enter password: " value={password} onChangeText={setPassword} />
      <View style={styles.radioContainer}>
        <RadioButton.Android value='True' onPress={() => setType(true)} status={type ? "checked" : "unchecked"} />
        <Text>Class Teacher</Text>
      </View>
      <View style={styles.radioContainer}>
        <RadioButton.Android value='False' onPress={() => setType(false)} status={type ? "unchecked" : "checked"} />
        <Text>Subject Teacher</Text>
      </View>
      <TextInput placeholder="Class teacher for: " value={ct} onChangeText={setCt} style={{ display: display }} />
      <Text>
        {message}
      </Text>
      <Button title="Signup" onPress={signup} />
      <View style={{ flexDirection: 'row' }}>
        <Text>
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.replace("Login")} style={{ marginLeft: 5 }}>
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
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center"
  }
})

export default Signup