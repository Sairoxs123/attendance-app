import React from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Modal, Alert, ScrollView, Button } from 'react-native'
import { useState, useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Note from "./Note"
import See from "./See"
import DatePicker from "react-native-modern-datepicker"
import { getFormatedDate } from 'react-native-modern-datepicker'
import { DataTable } from "react-native-paper"

const HomeScreen = ({ navigation }) => {

  const [teaches, setTeaches] = useState("")
  const [name, setName] = useState("")

  const today = new Date()
  const lastDate = getFormatedDate(today.setDate(today.getDate()), "YYYY/MM/DD")
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(null)
  const [students, setStudents] = useState("")
  const [attendance, setAttendance] = useState([])

  const getStored = async () => {
    const login = await AsyncStorage.getItem("logged_in")
    if (login === null) {
      navigation.navigate("Login")
    } else {
      const name = await AsyncStorage.getItem("name")
      if (name === null) {
        navigation.navigate("Login")
      } else {
        setName(name)
        const data = await AsyncStorage.getItem("teaches")
        if (data !== null) {
          setTeaches(data)
        } else {
          setTeaches(false)
        }
      }
    }
  }

  useEffect(() => {
    getStored()
  }, [])

  const handleClose = async () => {
    setOpen(!open)
    if (date) {
      let httpDate = date.split("/")
      httpDate = httpDate.join("-")
      axios.get(`
      https://saiteja123.pythonanywhere.com/attendance/get/mobile/?date=${httpDate}&grade=${teaches}
      `)
        .then(async (res) => {
          setStudents(res.data.students)
          setAttendance([])
        })
    }
  }

  useEffect(() => {
    if (typeof (students) == "object") {
      students.map((element) => {
        setAttendance(previous => {
          return [...previous, { id: element.id, present: true }]
        })

      })
    }
  }, [students])


  const changeAttendance = (id) => {

    setAttendance(previous => {
      const updated = previous.map(element => {
        if (element.id === id) {
          // Return a new object with updated present value using spread operator
          return { ...element, present: !element.present };
        } else {
          // Return the original element for other objects
          return element;
        }
      })

      return updated
    })

  }

  const markAttendance = async () => {
    let httpDate = date.split("/")
    httpDate = httpDate.join("-")
    const response = await axios.post(`
    https://saiteja123.pythonanywhere.com/attendance/mark/mobile/
    `, {
      date: httpDate,
      grade: teaches,
      attendance: attendance
    })
      .then(res => {
        setStudents("Attendance has been marked successfully.")
      })
  }


  return (
    <>
      <View style={styles.title}>
        <Text style={styles.nameText}>
          Hello {name}
        </Text>
      </View>

      {teaches ?
        <View style={{ flex: 1, justifyContent: "center", width: "100%", alignItems: 'center' }} >

          <Text style={{ marginTop: 10, marginBottom: 10, fontSize: 25, fontWeight: '700' }}>
            Selected Date : {date}
          </Text>

          {/* START OF DATE PICKER */}
          <View style={styles.Datecontainer}>

            <TouchableOpacity onPress={() => setOpen(!open)} style={{ padding: 11, borderRadius: 20, alignItems: 'center' }}>
              <Text>Select Date</Text>
            </TouchableOpacity>
            <Modal
              animationType='slide'
              transparent={true}
              visible={open}
            >

              <View style={styles.centeredView}>
                <View style={styles.modalView}>

                  <DatePicker
                    mode='calendar'
                    onDateChange={(date) => setDate(date)}
                    maximumDate={lastDate}
                    selected={date}
                  />

                  <TouchableOpacity onPress={handleClose}>
                    <Text>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </Modal>
          </View>
          {/* END OF DATE PICKER */}

        </View>
        :
        <Text style={{ fontSize: 30, textAlign: 'center', fontWeight: '900' }}>You cannot mark attendance because you are not a class teacher.</Text>
      }

      {typeof (students) == "string" ?
        <View style={{ height: 300, alignItems: "center" }}>
          <Text style={{ fontSize: 30, textAlign: 'center', fontWeight: '900' }}>
            {students}
          </Text>
        </View>
        :
        <>
          <ScrollView style={{ maxHeight: 300, minHeight: 300, marginBottom: 0 }}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Roll No.</DataTable.Title>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>Attendance</DataTable.Title>
              </DataTable.Header>


              {typeof (attendance) == "undefined" || attendance.length == 0 ? ""

                :

                students.map((element, index) => {
                  return (
                    <DataTable.Row key={index}>
                      <DataTable.Cell>
                        <Text>
                          {index + 1}
                        </Text>
                      </DataTable.Cell>
                      <DataTable.Cell>
                        <Text>
                          {element.name}
                        </Text>
                      </DataTable.Cell>
                      <DataTable.Cell>
                        <TouchableOpacity onPress={() => changeAttendance(element.id)}>
                          <Text>
                            {attendance[index].present ? 'Present' : 'Absent'}
                          </Text>
                        </TouchableOpacity>
                      </DataTable.Cell>
                    </DataTable.Row>
                  )
                })
              }
            </DataTable>
          </ScrollView>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={{ backgroundColor: 'cyan', padding: 20, borderRadius: 20 }} onPress={() => markAttendance()}>
              <Text style={{ fontSize: 20, fontWeight: '900' }}>
                Mark Attendance
              </Text>
            </TouchableOpacity>
          </View>
        </>
      }

    </>
  )
}


const Tab = createMaterialBottomTabNavigator();

const Home = ({ navigation }) => {

  const Logout = () => {
    AsyncStorage.clear()
    navigation.replace("Login")
  }

  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      activeColor="#e91e63"
      barStyle={{ backgroundColor: 'cyan' }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="View"
        component={See}
        options={{
          tabBarLabel: 'View',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="eye" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Notes"
        component={Note}
        options={{
          tabBarLabel: 'Note',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="note-text-outline" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Logout"
        component={Logout}
        options={{
          tabBarLabel: 'Logout',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="logout" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  Datecontainer: {
    backgroundColor: '#fff',
    width: 100
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: "90%",
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 150,
    backgroundColor: "cyan",
    paddingTop: 15,
  },
  nameText: {
    fontSize: 35,
    marginLeft: 10,
    fontWeight: '900'
  },
})


export default Home