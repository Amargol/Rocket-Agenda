import { observable, computed, action } from "mobx";
import { AsyncStorage } from "react-native";

export default class Store {
  constructor() {
    this.initFromStore();
  }

  @action
  initFromStore() {
    AsyncStorage.getItem("dates").then(dates => {
      if (dates !== null) {
        this.dates = JSON.parse(dates);
      }
    });

    AsyncStorage.getItem("content").then(content => {
      if (content !== null) {
        this.content = JSON.parse(content);
      }
    });
  }

  @action
  saveToStore() {
    AsyncStorage.setItem("dates", JSON.stringify(this.dates));
    AsyncStorage.setItem("content", JSON.stringify(this.content));
  }

  @observable dates = [];
  @observable content = {};

  @action
  addTaskToNewDate(task, date) {
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
        notes: ""
      })
    ]);
  }

  @action
  addTaskToExistingDate(task, date) {
    this.content[date].push({
      task: task,
      id: Math.floor(Math.random() * 1000000000).toString(),
      notes: ""
    });
  }

  @action
  addTask(task, date) {
    if (this.content[date] === undefined) {
      this.addTaskToNewDate(task, date);
    } else {
      this.addTaskToExistingDate(task, date);
    }
    this.saveToStore();
  }

  @action
  removeTask(task, date) {
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
    this.saveToStore();
  }

  @computed
  get markedDates() {
    let markedDates = this.dates.reduce((obj, item) => {
      obj[item] = { marked: true };
      return obj
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
}
