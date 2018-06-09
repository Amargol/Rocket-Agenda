//import liraries
import React, { Component } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Modal,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform
} from "react-native";
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";
import DayInAgenda from "./DayInAgenda";

// create a component
@inject("store")
@observer
class Agenda extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.saveText = this.saveText.bind(this);
    this.prevIndex = "";
    this.state = {
      modalVisible: false,
      modalContent: {
        date: "",
        formattedDate: "",
        task: "",
        color: "white",
        notes: "",
        id: ""
      }
    };
  }
  openModal(date, formattedDate, task, color, notes, id) {
    this.setState({
      modalVisible: true,
      modalContent: {
        date: date,
        formattedDate: formattedDate,
        task: task,
        color: color,
        notes: notes,
        id: id
      }
    });
  }
  closeModal() {
    this.setState({ modalVisible: false });
  }
  saveText(value) {
    let { modalContent } = this.state;
    let { store } = this.props;

    let index = store.content[modalContent.date]
      .map(e => e.id)
      .indexOf(modalContent.id);

    store.content[modalContent.date][index].notes = value;

    store.saveToStore();
  }
  componentDidUpdate() {
    let { store } = this.props;

    // Scroll to an index when user presses a date on the calendar
    // props.index is the desired date to scroll to
    // Find indexOf the desired date to scroll to and use scrollToIndex
    let index = toJS(store.dates).indexOf(this.props.index);
    if (index !== -1 && this.props.index !== this.prevIndex) {
      this.flatListRef.scrollToIndex({ animated: true, index: index });
      this.prevIndex = this.props.index;
    }
  }
  render() {
    return (
      <View>
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
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.closeModal}
        >
          {Platform.OS === "ios" ? <StatusBar barStyle="dark-content" /> : null}
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: "#F5F5F5",
              position: "relative"
            }}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity activeOpacity={0.4} onPress={this.closeModal}>
                <Text style={styles.closeButton}>Close and Save</Text>
              </TouchableOpacity>
              <ScrollView>
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
                  <View style={styles.textInputContainer}>
                    <TextInput
                      multiline={true}
                      style={styles.textInput}
                      placeholder={"Notes"}
                      underlineColorAndroid="#eee"
                      placeholderTextColor="black"
                      onChangeText={this.saveText}
                      defaultValue={this.state.modalContent.notes}
                    />
                  </View>
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        </Modal>
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
    margin: 15
  },
  textContainer: {
    marginBottom: 15,
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
    borderRadius: 10,
    padding: 10,
    marginBottom: 20
  },
  textInput: {
    // paddingBottom: 5
  }
});

//make this component available to the app
export default Agenda;
