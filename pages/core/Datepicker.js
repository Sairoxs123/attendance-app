import React, { useState } from 'react'
import { TouchableOpacity, View, Text, Modal, StyleSheet } from 'react-native'
import DatePicker from "react-native-modern-datepicker"
import { getToday, getFormatedDate } from 'react-native-modern-datepicker'

const Datepicker = () => {
    const today = new Date()
    const lastDate = getFormatedDate(today.setDate(today.getDate()), "YYYY/MM/DD")
    const [open, setOpen] = useState(false)
    const [date, setDate] = useState(String(`${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`))

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setOpen(!open)}>
                <Text>Open</Text>
            </TouchableOpacity>
            <Modal
                animationType='slide'
                transparent={true}
                visible={open}
            >

                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        <DatePicker
                        mode='calender'
                        onDateChange={(date) => setDate(date)}
                        maximumDate={lastDate}
                        />

                        <TouchableOpacity onPress={() => setOpen(!open)}>
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        justifyContent: 'center'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22
    },
    modalView: {
        margin: 20,
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
        elevation: 5
    }
})

export default Datepicker