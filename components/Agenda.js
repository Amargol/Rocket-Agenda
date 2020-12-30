//import liraries
import React, { Component } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Modal,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Keyboard
} from "react-native";
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";
import DayInAgenda from "./DayInAgenda";
import NotificationSettings from "./NotificationSettings";
import * as Notifications from 'expo-notifications';

// create a component
@inject("store")
@observer
class Agenda extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.saveText = this.saveText.bind(this);
    this.notificationSettings = React.createRef()
    this.state = {
      modalVisible: false,
      modalContent: {
        date: "",
        formattedDate: "",
        task: "",
        color: "white",
        notes: "",
        id: "",
        notificationSettings: {}
      }
    };
  }
  openModal(date, formattedDate, task, color, notes, id, notificationSettings) {
    if (notificationSettings.notifying && (new Date()) > (new Date(notificationSettings.dateTimeObj))) {
      notificationSettings = {
        notifying: false
      }
    }

    this.setState({
      modalVisible: true,
      modalContent: {
        date: date,
        formattedDate: formattedDate,
        task: task,
        color: color,
        notes: notes,
        id: id,
        notificationSettings: notificationSettings
      }
    })
  }
  
  async closeModal() {
    let notificationSettings = this.notificationSettings.current.getTimingData(this.getFormattedDateForChrono(this.state.modalContent.date))

    if (notificationSettings === null) {
      alert('Please enter a valid notification time')
      return
    }

    if (notificationSettings.notifying && (new Date()) > notificationSettings.dateTimeObj) {
      alert('Notification time must be in the future')
      return
    }

    let prev = this.state.modalContent.notificationSettings

    if (prev.notifying) {
      Notifications.cancelScheduledNotificationAsync(prev.identifier);
    }

    if (notificationSettings.notifying && (new Date()) < (new Date(notificationSettings.dateTimeObj))) {

      let notificationDayString = "Today"

      if (notificationSettings.notificationDay == -1) {
        notificationDayString = "Tomorrow"
      } else if (notificationSettings.notificationDay == 1) {
        notificationDayString = "Yesterday"
      } else if (notificationSettings.notificationDay < -1) {
        notificationDayString = "In " + (-notificationSettings.notificationDay) + " days"
      } else if (notificationSettings.notificationDay > 1) {
        notificationDayString = (notificationSettings.notificationDay) + " days ago"
      }


      notificationSettings.identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: this.state.modalContent.task,
          message: notificationDayString,
          body: notificationDayString,
          autoDismiss: false,
          vibrate: true
        },
        trigger: new Date(notificationSettings.dateTimeObj)
      });
    }

    this.updateTime(notificationSettings)

    this.setState({ modalVisible: false })
  }

  saveText(value) {
    let { modalContent } = this.state;
    let { store } = this.props;

    let index = store.content[modalContent.date]
      .map(e => e.id)
      .indexOf(modalContent.id)

    store.content[modalContent.date][index].notes = value;

    store.saveToStore();
  }

  updateTime(notificationSettings) {
    let { modalContent } = this.state;
    let { store } = this.props;

    let index = store.content[modalContent.date]
      .map(e => e.id)
      .indexOf(modalContent.id)
    
    store.content[modalContent.date][index].notificationSettings = notificationSettings;
    
    store.saveToStore();
  }
  
  getFormattedDateForChrono (date) {
    let dateArr = date.split("-");
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let dayNum = parseInt(dateArr[2]);
    let month = months[parseInt(dateArr[1] - 1, 10)];
    let year = dateArr[0];
    return dayNum + " " + month + " " + year
  }

  renderFooter(length) {
    if (length === 0) {
      return (
        <View style={{ padding: 20 }}>
          <Text style={styles.tutorialTextHeader}>
            You don't have any tasks yet
          </Text>
          <View style={{ marginVertical: 10 }}>
            <Text style={styles.tutorialText}>
              Drag the grey bar to move the agenda
            </Text>
            <Text style={styles.tutorialText}>
              Long press a date on the calendar to add a task
            </Text>
            <Text style={styles.tutorialText}>
              Touch a date on the calendar to scroll to it
            </Text>
            <Text style={styles.tutorialText}>
              Tap a task to attach a note to it
            </Text>
          </View>
          <View style={{paddingBottom: 70}}>
            <Text style={styles.tutorialText}>
              <Text style={styles.redText}>Red</Text> tasks are overdue
            </Text>
            <Text style={styles.tutorialText}>
              <Text style={styles.yellowText}>Yellow</Text> tasks are due today
            </Text>
            <Text style={styles.tutorialText}>
              <Text style={styles.greenText}>Green</Text> tasks are due tomorrow
            </Text>
            <Text style={styles.tutorialText}>
              <Text style={styles.blueText}>Blue</Text> tasks are due in the future
            </Text>
            <Text style={styles.tutorialText}>
              <Text style={styles.lightBlueText}>Light blue</Text> tasks are due in the distant future
            </Text>
          </View>
        </View>
      );
    } else {
      return <View style={{ height: 90 }} />;
    }
  }

  renderAgendaContent() {
    return (this.props.store.isDoneLoading) ?
      <FlatList
        data={toJS(this.props.store.dates)}
        renderItem={({ item }) => (
          <DayInAgenda date={item} openModal={this.openModal} />
        )}
        keyExtractor={item => {
          return item;
        }}
        ref={ref => {
          this.flatListRef = ref;
        }}
        ListFooterComponent={this.renderFooter(this.props.store.dates.length)}
      />
      :
      <View>
        <ActivityIndicator size="large" style={{marginTop: 50}}/>
      </View>
  }

  componentDidUpdate() {
    let { store } = this.props;

    // Scroll to an index when user presses a date on the calendar
    // props.index is the desired date to scroll to
    // Find indexOf the desired date to scroll to and use scrollToIndex
    let index = toJS(store.dates).indexOf(this.props.index);
    if (index !== -1 && index !== null) {
      this.flatListRef.scrollToIndex({ animated: true, index: index });
      this.props.resetIndex();
    }
  }

  renderTaskModal() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={this.closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{flex: 1}}
        >
        {Platform.OS === "ios" ? <StatusBar barStyle="dark-content" /> : null}
        <SafeAreaView style={{flex: 0, backgroundColor: "#F5F5F5"}}/>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "white",
            position: "relative"
          }}
        >
            <View style={styles.modalContainer}>
              <TouchableOpacity activeOpacity={0.4} onPress={this.closeModal}>
                <Text style={styles.closeButton}>Close and Save</Text>
              </TouchableOpacity>
              <ScrollView style={{marginBottom: 15}}>
                <View style={styles.modalContentContainer}>
                  <View
                    style={[
                      styles.textContainer,
                      {
                        borderLeftWidth: 5,
                        borderLeftColor: this.state.modalContent.color
                      }
                    ]}
                  >
                    <Text style={styles.textStyle}>
                      {this.state.modalContent.formattedDate}
                    </Text>
                    <Text style={styles.taskStyle}>
                      {this.state.modalContent.task}
                    </Text>
                  </View>
                  <View>
                    <NotificationSettings taskText={this.state.modalContent.task} initial={this.state.modalContent.notificationSettings} submit={() => {Keyboard.dismiss()}} ref={this.notificationSettings} type="Update"/>
                  </View>
                  <View style={styles.textInputContainer}>
                    <TextInput
                      multiline={true}
                      style={styles.textInput}
                      placeholder={"Notes"}
                      underlineColorAndroid="#F5F5F5"
                      placeholderTextColor="black"
                      onChangeText={this.saveText}
                      defaultValue={this.state.modalContent.notes}
                      scrollEnabled={false}
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
        </SafeAreaView>
          </KeyboardAvoidingView>
      </Modal>
    )
  }

  render() {
    return (
      <View>
        {this.renderAgendaContent()}
        {this.renderTaskModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    overflow: "hidden",
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17
  },
  closeButton: {
    backgroundColor: "#F5F5F5",
    textAlign: "center",
    padding: 17
  },
  modalContentContainer: {
    marginHorizontal: 15,
    marginTop: 15
  },
  textContainer: {
    marginBottom: 6,
    paddingHorizontal: 7,
    marginVertical: 2
  },
  textStyle: {
    fontSize: 24,
    fontFamily: "System",
    fontWeight: "700",
    paddingBottom: 2
  },
  taskStyle: {
    fontFamily: "System",
    fontSize: 18,
    paddingTop: 2,
    paddingBottom: 5,
    paddingHorizontal: 1
  },
  textInputContainer: {
    backgroundColor: "#eee",
    borderRadius: 7,
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 7,
    marginTop: 7
  },
  textInput: {
    // padding: 10
    paddingBottom: 0
  },
  tutorialTextHeader: {
    fontSize: 23,
    fontWeight: "bold"
  },
  tutorialText: {
    fontSize: 13,
    marginVertical: 1,
    color: "#606060"
  },
  redText: {
    color: "#EA4335",
    fontWeight: "bold"
  },
  yellowText: {
    color: "rgba(251, 184, 5, 1)",
    fontWeight: "bold"
  },
  greenText: {
    color: "rgba(52, 168, 83, .7)",
    fontWeight: "bold"
  },
  blueText: {
    color: "rgb(66, 133, 244)",
    fontWeight: "bold"
  },
  lightBlueText: {
    color: "rgba(66, 133, 244, .3)",
    fontWeight: "bold"
  },
});

//make this component available to the app
export default Agenda;
