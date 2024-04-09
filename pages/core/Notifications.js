import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Button } from 'react-native';
import { useState, useEffect } from 'react';
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationScreen = ({ navigation }) => {

    const [email, setEmail] = useState("")
    const [unseen, setUnseen] = useState("")
    const [seen, setSeen] = useState("")

    const getStored = async () => {
        setEmail(await AsyncStorage.getItem("email"))
    }

    useEffect(() => {
        getStored()
    }, [])

    const getNotifications = async () => {
        const response = await axios.get(`
        https://saiteja123.pythonanywhere.com/nofitifications/get/unseen/?email=${email}
        `).then(res => {
            if (res.data.unseen.length == 0) {
                setUnseen("You have no unseen notifications.")
            } else {
                setUnseen(res.data.unseen)
            }
            if (res.data.seen.length == 0) {
                setSeen("You have no seen notifications.")
            } else {
                setSeen(res.data.seen)
            }
        })
    }

    useEffect(() => {
        getNotifications()
    })

    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 50 }}>
                {typeof (unseen) !== "string" ?
                    <>
                        <Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>Your Unseen Notifications</Text>
                        <ScrollView style={{ maxHeight: 200, marginTop: 25 }}>
                            {unseen.map((element, index) => {
                                return (
                                    <TouchableOpacity key={index} onPress={() => navigation.navigate("Notification", { id: element.id, sent_by: element.sent_by, date: element.date, message: element.message, seen: false })} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <Text style={{ fontSize: 20, maxWidth: "95%", textAlign: "center" }}>
                                            {index + 1}. From {element.sent_by} - {element.date}
                                        </Text>
                                        <MaterialCommunityIcons name="arrow-right-circle" color="black" size={26} />
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </>
                    :
                    <Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>
                        {unseen}
                    </Text>
                }
            </View>

            <View>
                {typeof (seen) !== "string" ?
                    <>
                        <Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>Your Seen Notifications</Text>
                        <ScrollView style={{ maxHeight: 200 }}>
                            {seen.map((element, index) => {
                                return (
                                    <TouchableOpacity key={index} onPress={() => navigation.navigate("Notification", { id: element.id, sent_by: element.sent_by, date: element.date, message: element.message, seen: true })} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <Text style={{ fontSize: 20, maxWidth: "95%", textAlign: "center" }}>
                                            {index + 1}. From {element.sent_by} - {element.date}
                                        </Text>
                                        <MaterialCommunityIcons name="arrow-right-circle" color="black" size={26} />
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </>
                    :
                    <Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>
                        {seen}
                    </Text>
                }
            </View>

        </View>
    )
}

const Notification = ({ route, navigation }) => {

    //{id:element.id, sent_by:element.sent_by, date:element.date, message:element.message, seen:false})}

    const { id, sent_by, date, message, seen } = route.params

    const [seen_status, setSeen] = useState(seen);

    const markAsRead = async () => {
        const response = axios.get(
            `https://saiteja123.pythonanywhere.com/notifications/mark/read/?id=${id}`
        ).then(
            res => {
                setSeen(true);
            }
        )
    }

    return (
        <>
            <View style={styles.title}>
                <TouchableOpacity onPress={() => navigation.navigate('NotifScreen')} style={{ position: 'absolute', left: 5, alignSelf: 'center' }}>
                    <MaterialCommunityIcons name='arrow-left-thick' size={30} />
                </TouchableOpacity>
                <Text style={styles.nameText}>
                    {sent_by}
                </Text>
            </View>

            <View style={styles.notification}>

                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    Date: {date}
                </Text>

                <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
                    Message:
                </Text>
                <ScrollView style={{ maxHeight: 300, height: "auto", marginTop: 15, maxWidth: '90%' }} >
                    <View>
                        {message.map((element, index) => {
                            return (
                                <Text style={{ fontSize: 20, fontWeight: "bold" }} key={index}>
                                    {index + 1}. {element.replace('"', "")}
                                </Text>
                            )
                        })}
                    </View>
                </ScrollView>

                {!seen_status ?
                    <Button title="Mark notification as read" onPress={() => markAsRead()} />
                    :
                    <Text>
                        This notification has been marked as read.
                    </Text>}

            </View>

        </>
    )
}

const Stack = createStackNavigator()

const Notifications = ({ navigation }) => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='NotifScreen' component={NotificationScreen} />
            <Stack.Screen name='Notification' component={Notification} />
        </Stack.Navigator>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 75
    },
    title: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 135,
        backgroundColor: "cyan",
    },
    nameText: {
        fontSize: 35,
        marginLeft: 10,
        fontWeight: '900',
        maxWidth: "82%"
    },
    notification: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})


export default Notifications
