import React from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage"
import DatePicker from "react-native-modern-datepicker"
import { getFormatedDate } from 'react-native-modern-datepicker'
import { MultiSelect } from 'react-native-element-dropdown';
import axios from "axios"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from '@react-navigation/stack';
import { DataTable } from "react-native-paper"


const NotesScreen = ({ navigation }) => {
  const [name, setName] = useState("")
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(null)
  const [selected, setSelected] = useState([]);
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const today = new Date()
  const lastDate = getFormatedDate(today.setDate(today.getDate()), "YYYY/MM/DD")

  const [data, setData] = useState([])

  const getStored = async () => {
    setName(await AsyncStorage.getItem("name"))
    return true
  }

  const handleClose = async () => {
    setOpen(!open)
  }

  const getStudents = async () => {
    const response = await axios.get(
      'https://saiteja123.pythonanywhere.com/details/fetch/students/mobile/'
    ).then(
      res => {
        setData(res.data.students)
      }
    )

    return true
  }

  useEffect(() => {
    getStored()
    getStudents()
  }, [])


  const createNote = async () => {
    if (selected.length > 0 && date != null && title != "" && description != "") {
      let httpDate = date.split("/")
      httpDate = httpDate.join("-")
      const response = await axios.post(
        `https://saiteja123.pythonanywhere.com/notes/mobile/create/`,
        {
          name: name,
          date: httpDate,
          title: title,
          description: description,
          students: selected
        }
      ).then(res => {
        Alert.alert("Success", res.data.created)
        setTitle("")
        setDescription("")
        setDate(null)
        setSelected([])
      })
    } else {
      Alert.alert("Form not filled.", "Please recheck if you have missed any field in the form.")
    }
  }


  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => navigation.navigate("NotesList", { teacher: name })} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', elevation: 5, padding: 7, borderRadius: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>
          Your notes
        </Text>
        <MaterialCommunityIcons name="arrow-right-circle" color="black" size={26} />
      </TouchableOpacity>

      <TextInput placeholder='Enter Title: ' value={title} onChangeText={setTitle} style={{ marginTop: 25, fontSize: 20, width: "95%", padding: 10 }} />

      <Text style={{ marginBottom: 10,  marginTop: 25 }}>
        Selected Date: {date}
      </Text>

      {/* START OF DATE PICKER */}

      <View style={{ width: "100%", alignItems: 'center' }} >

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
                  minimumDate={lastDate}
                  selected={date}
                />

                <TouchableOpacity onPress={handleClose}>
                  <Text>Close</Text>
                </TouchableOpacity>
              </View>
            </View>

          </Modal>
        </View>
      </View>

      {/* END OF DATE PICKER */}

      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        search
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Select students"
        searchPlaceholder="Search..."
        value={selected}
        onChange={item => {
          setSelected(item);
        }}
        selectedStyle={styles.selectedStyle}
      />


      <TextInput placeholder='Enter Description: ' multiline={true} value={description} onChangeText={setDescription} style={{ marginTop: 25, fontSize: 20, width: "95%", padding: 5, maxHeight: 80 }} />

      <TouchableOpacity onPress={() => createNote()} style={{ marginTop: 50, backgroundColor: 'cyan', padding: 15, borderRadius: 20 }}>
        <Text style={{ fontSize: 30, fontWeight: '600' }}>
          Create Note
        </Text>
      </TouchableOpacity>


    </View>
  )
}

const NotesList = ({ route, navigation }) => {

  const { teacher } = route.params

  const [notes, setNotes] = useState("")

  const getNotesList = async () => {
    const request = await axios.get(
      `https://saiteja123.pythonanywhere.com/notes/mobile/fetch/?name=${teacher}`
    ).then(
      res => {
        setNotes(res.data.notes)
      }
    )
  }

  const deleteNote = async (id) => {
    const request = await axios.get(
      `https://saiteja123.pythonanywhere.com/notes/mobile/delete/?id=${id}`
    ).then(
      res => {
        Alert.alert("Note has been deleted.")
        getNotesList()
      }
    )
  }

  useEffect(() => {
    getNotesList();
  }, [])

  return (
    <>
      <View style={styles.title}>
        <TouchableOpacity onPress={() => navigation.navigate('NotesScreen')}>
          <MaterialCommunityIcons name='arrow-left-thick' size={30} />
        </TouchableOpacity>
        <Text style={styles.nameText}>
          Your notes
        </Text>
      </View>
      <View style={styles.container}>
        {typeof (notes) == "string"
          ?
          <Text style={{ fontSize: 50, fontWeight: '900' }}>
            {notes}
          </Text>
          :
          <ScrollView style={{ maxHeight: 200, minHeight: 200, width: "100%", marginLeft: 5 }}>
            <Text style={{ fontSize: 20, fontWeight: '900', textDecorationLine: 'underline' }}>
              Notes
            </Text>
            {notes.map((element, index) => {
              return (
                <View key={index} style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity style={styles.noteBtn} onPress={() => navigation.navigate("ViewNote", { id: element.id, title: element.title, teacher: element.teacher, description: element.description, students: element.mentioned })}>
                    <Text style={{ fontSize: 20, maxWidth: "95%" }}>
                      {index + 1}. {element.title} on {element.date}
                    </Text>
                    <MaterialCommunityIcons name="arrow-right-circle" color="black" size={26} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteNote(element.id)}>
                    <MaterialCommunityIcons name='delete' color="red" size={26} />
                  </TouchableOpacity>
                </View>
              )
            })}
          </ScrollView>
        }
      </View>
    </>
  )
}

const ViewNote = ({ route, navigation }) => {

  const { id, title, teacher, description, students } = route.params

  return (
    <>
      <View style={styles.title}>
        <TouchableOpacity onPress={() => navigation.navigate('NotesList', {teacher:teacher})}>
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
        <ScrollView style={{ width: "95%", elevation: 10, backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 10 }}>
          <Text style={{ textAlign: 'center', marginBottom: 10 }}>
            {description}
          </Text>
        </ScrollView>
      </View>

    </>
  )
}


const Stack = createStackNavigator()

const Note = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='NotesScreen' component={NotesScreen} />
      <Stack.Screen name='NotesList' component={NotesList} />
      <Stack.Screen name='ViewNote' component={ViewNote} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40
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
  dropdown: {
    height: 50,
    backgroundColor: 'transparent',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    width: "95%",
    marginTop: 20
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  selectedStyle: {
    borderRadius: 12,
  },
  noteBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'bisque',
    borderRadius: 20,
    width: "90%",
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


export default Note