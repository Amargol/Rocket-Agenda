import { observable, computed, action } from "mobx";
import { AsyncStorage } from "react-native";

import * as Notifications from 'expo-notifications';

export default class Store {
  constructor() {
    this.initFromStore();
  }

  // Sorted array of dates
  @observable dates = []
  // Dictionary of tasks. content[date] returns an array of tasks
  @observable content = {}

  @observable loadedDates = false
  @observable loadedContent = false

  // @observable recentlyDeleted = [{task: "task", date: "date", notes: "notes", id: "id", backgroundNumber: 0}]
  @observable recentlyDeleted = []

  backgroundNumber = 0
  

  // Get dates and content from asyncStorage
  @action
  initFromStore() {
    AsyncStorage.getItem("dates").then(dates => {
      if (dates !== null) {
        this.dates = JSON.parse(dates)
      }
      this.loadedDates = true
    });

    AsyncStorage.getItem("content").then(content => {
      function stringDate(date) {
        let today =
          date.getUTCFullYear() +
          "-" +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + date.getDate()).slice(-2);

        return today;
      }
      if (content !== null) {
        this.content = JSON.parse(content);
      }
      this.loadedContent = true
    });
  }

  // Save dates and content to asyncStorage
  @action
  saveToStore() {
    AsyncStorage.setItem("dates", JSON.stringify(this.dates));
    AsyncStorage.setItem("content", JSON.stringify(this.content));
  }

  // Adds a task
  @action
  addTaskToNewDate(task, date, notes, notificationSettings) {
    function isDateBigger(date1, date2) {
      date1 = date1.split("-");
      date2 = date2.split("-");

      let date1Year = parseInt(date1[0]);
      let date1Month = parseInt(date1[1]) - 1;
      let date1Day = parseInt(date1[2]);

      let date2Year = parseInt(date2[0]);
      let date2Month = parseInt(date2[1]) - 1;
      let date2Day = parseInt(date2[2]);

      date1 = new Date(date1Year, date1Month, date1Day);
      date2 = new Date(date2Year, date2Month, date2Day);

      return date2 > date1;
    }
    insertIndex = this.dates.length;
    for (let i = 0; i < this.dates.length; i++) {
      if (isDateBigger(date, this.dates[i])) {
        insertIndex = i;
        break;
      }
    }
    this.dates.splice(insertIndex, 0, date);
    this.content[date] = observable([
      observable({
        task: task,
        id: Math.floor(Math.random() * 1000000000).toString(),
        notes: notes,
        notificationSettings
      })
    ]);
  }

  // Adds a task to an existing date
  @action
  addTaskToExistingDate(task, date, notes, notificationSettings) {
    this.content[date].push({
      task: task,
      id: Math.floor(Math.random() * 1000000000).toString(),
      notes: notes,
      notificationSettings
    });
  }

  // Determines whether to use addTaskToNewDate or addTaskToExistingDate then calls saveToStore
  @action
  async addTask(task, date, notes, notificationSettings) {
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
          title: task,
          message: notificationDayString,
          body: notificationDayString,
          autoDismiss: false,
        },
        trigger: new Date(notificationSettings.dateTimeObj)
      });
    }

    if (this.content[date] === undefined) {
      this.addTaskToNewDate(task, date, notes, notificationSettings);
    } else {
      this.addTaskToExistingDate(task, date, notes, notificationSettings);
    }
    this.saveToStore();
  }

  // Removes a task
  @action
  removeTask(task, date) {
    if (task.notificationSettings.notifying) {
      Notifications.cancelScheduledNotificationAsync(task.notificationSettings.identifier);
    }

    if (this.content[date].length === 1) {
      this.dates.splice(this.dates.indexOf(date), 1);
      this.content[date] = undefined;
    } else {
      this.content[date].splice(
        this.content[date]
          .map(function(e) {
            return e.id;
          })
          .indexOf(task.id),
        1
      );
    }

    this.addToRecentlyDeletedQueue(task.task, date, task.notes, task.id, task.notificationSettings)

    this.saveToStore();
  }

  @action
  addToRecentlyDeletedQueue(task, date, notes, id, notificationSettings) {
    this.recentlyDeleted.push({task: task, date: date, notes: notes, id: id, notificationSettings, backgroundNumber: this.backgroundNumber})

    this.backgroundNumber = (this.backgroundNumber + 1) % 9

    setTimeout(() => {
      ix = this.recentlyDeleted.map(e => e.id).indexOf(id)

      if (ix == -1) {
        return
      }

      this.recentlyDeleted.splice(ix, 1)
      
    }, 8000); // if you change this, you must change callback in notification constructor to be x - duration
  }

  // Defines which dates on the calendar are marked in accordance to react-native-calendars
  // https://github.com/wix/react-native-calendars
  @computed
  get markedDates() {
    let markedDates = this.dates.reduce((obj, item) => {
      obj[item] = { marked: true };
      return obj;
    }, {});
    let date = new Date();
    let today =
      date.getUTCFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2);

    markedDates[today] = { selected: true };

    return markedDates;
  }

  @computed
  get isDoneLoading() {
    return this.loadedContent && this.loadedDates
  }
}
