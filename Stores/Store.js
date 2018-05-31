import { observable, computed, action } from "mobx";

export default class Store {
  @observable dates = [];
  @observable content = {};

  @action
  addTaskToNewDate(task, date) {
    function isDateBigger(date1, date2) {
      date1 = date1.split("-");
      date2 = date2.split("-");

      let date1Year = parseInt(date1[0]);
      let date1Month = parseInt(date1[1]);
      let date1Day = parseInt(date1[2]);

      let date2Year = parseInt(date2[0]);
      let date2Month = parseInt(date2[1]);
      let date2Day = parseInt(date2[2]);

      date1 = new Date(date1Year, date1Month, date1Day);
      date2 = new Date(date2Year, date2Month, date2Day);

      console.log(date2Day, '>', date1Day, date2>date1)
      
      return date2 > date1;
    }
    insertIndex = this.dates.length;
    for (var i = 0; i < this.dates.length; i++) {
      if (isDateBigger(date, this.dates[i])) {
        insertIndex = i;
        break;
      }
    }
    this.dates.splice(insertIndex, 0, date);
    this.content[date] = observable([task]);
  }

  @action
  addTaskToExistingDate(task, date) {
    this.content[date].push(task);
  }

  @action
  addTask(task, date) {
    if (this.content[date] === undefined) {
      this.addTaskToNewDate(task, date);
    } else {
      this.addTaskToExistingDate(task, date);
    }
  }

  @computed
  get markedDates() {}
}
