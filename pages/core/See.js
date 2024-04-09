import React from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Modal, Alert, ScrollView, Button, TextInput } from 'react-native'
import { useState, useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from "react-native-modern-datepicker"
import { getFormatedDate } from 'react-native-modern-datepicker'
import axios from "axios"
import { DataTable } from "react-native-paper"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';


const SeeScreen = ({ navigation }) => {

  const [grade, setGrade] = useState("")
  const [date, setDate] = useState("")
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [attendance, setAttendance] = useState("")

  const today = new Date()
  const lastDate = getFormatedDate(today.setDate(today.getDate()), "YYYY/MM/DD")

  const data = [
    { label: '11A', value: '11A' },
    { label: '11B', value: '11B' },
    { label: '11C', value: '11C' },
    { label: '11D', value: '11D' },
    { label: '11E', value: '11E' },
  ];

  const getStored = async () => {
    const data = await AsyncStorage.getItem("teaches")
    if (data !== null) {
      setGrade(data)
    } else {
      setGrade(false)
    }
  }

  const handleClose = async () => {
    setOpen(!open)
  }


  useEffect(() => {
    getStored()
  }, [])

  const fetchDetails = async () => {
    let httpDate = date.split("/")
    httpDate = httpDate.join("-")
    const response = await axios.get(
      `https://saiteja123.pythonanywhere.com/details/fetch/mobile/?grade=${grade}&date=${httpDate}`
    ).then(
      res => {
        setNotes(res.data.note)
        setAttendance(res.data.attendance)
      }
    )
  }

  return (
    <View style={styles.container}>

      {/* START OF GRADE PICKER */}
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select Class"
        searchPlaceholder="Search..."
        value={grade}
        onChange={item => {
          setGrade(item.value);
        }}
      />
      {/* END OF GRADE PICKER */}

      <Text style={{ marginBottom: 5 }}>
        Selected Date: {date}
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

      <TouchableOpacity style={{ backgroundColor: 'cyan', padding: 20, borderRadius: 20, marginTop: 20 }} onPress={() => fetchDetails()}>
        <Text style={{ fontSize: 15, fontWeight: '900' }}>
          Fetch Details
        </Text>
      </TouchableOpacity>

      {typeof (notes) == "string" ?
        <View style={{ height: 100, alignItems: "center", marginTop: 100 }}>
          <Text style={{ fontSize: 30, textAlign: 'center', fontWeight: '900' }}>
            {notes}
          </Text>
        </View> :
        <ScrollView style={{ maxHeight: 200, minHeight: 200, width: "100%", marginLeft: 5 }}>
          <Text style={{ fontSize: 20, fontWeight: '900', textDecorationLine: 'underline' }}>
            Notes
          </Text>
          {notes.map((element, index) => {
            return (
              <TouchableOpacity key={index} style={styles.noteBtn} onPress={() => navigation.navigate("ViewNote", { id: element.id, title: element.title, teacher: element.teacher, description: element.description, students: element.mentioned })}>
                <Text style={{ fontSize: 20, maxWidth: "95%" }}>
                  {index + 1}. {element.title} by {element.teacher}
                </Text>
                <MaterialCommunityIcons name="arrow-right-circle" color="black" size={26} />
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      }

      {typeof (attendance) == "string" ?
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 30, textAlign: 'center', fontWeight: '900' }}>
            {attendance}
          </Text>
        </View>
        :
        <ScrollView style={{ width: "100%" }}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Roll No.</DataTable.Title>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Attendance</DataTable.Title>
            </DataTable.Header>

            {attendance.map((element, index) => {
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
                    <Text>
                      {element.present ? 'Present' : 'Absent'}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              )
            })}

          </DataTable>
        </ScrollView>
      }

    </View>
  )
}

const ViewNote = ({ route, navigation }) => {
  const { id, title, teacher, description, students } = route.params

  return (
    <>
      <View style={styles.title}>
        <TouchableOpacity onPress={() => navigation.navigate('SeeScreen')}>
          <MaterialCommunityIcons name='arrow-left-thick' size={30} />
        </TouchableOpacity>
        <Text style={styles.nameText}>
          {
            title.length > 41 ? title.slice(0, 38) + "..." : title
          }
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={{ fontSize: 15, fontWeight: '500' }}>
          Created By: {teacher}
        </Text>
        <Text style={{ marginTop: 20, fontSize: 15, fontWeight: '500' }}>
          Students:
        </Text>
        <ScrollView style={{ minWidth: "100%", maxHeight: 275, marginLeft: 50, minHeight: 275 }}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>S No.</DataTable.Title>
              <DataTable.Title>Name</DataTable.Title>
              <DataTable.Title>Class</DataTable.Title>
            </DataTable.Header>
            {students.map((element, index) => {
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
                    <Text>
                      {element.grade}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              )
            })}
          </DataTable>
        </ScrollView>
        <Text style={{ fontSize: 15, fontWeight: '500' }}>
          Description:
        </Text>
        <ScrollView style={{ width: "95%", minHeight: 0, elevation: 10, backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 10 }}>
          <Text style={{ textAlign: 'center', marginBottom: 10 }}>
            {description}
          </Text>
        </ScrollView>
      </View>

    </>
  )
}

const Stack = createStackNavigator()

const See = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='SeeScreen' component={SeeScreen} />
      <Stack.Screen name='ViewNote' component={ViewNote} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    maxHeight: 150,
    backgroundColor: "cyan",
    paddingTop: 15,
    paddingLeft: 5
  },
  nameText: {
    fontSize: 35,
    fontWeight: '900',
    width: "90%",
    textAlign: 'center'
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    width: "75%"
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
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
  noteBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'bisque',
    borderRadius: 20,
    width: "99%",
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 2
  }
})


export default See