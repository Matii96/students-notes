import _ from 'lodash';
import moment from 'moment';
import modes from './modes';
import IFormatResult from '@/interfaces/Date/FormatResult';

export default class DateFormatter {
  private static TranslateDataKeys(modeKey: string, datasets: any[], from: Date): { [timeKey: number]: any } {
    let newData: { [timeKey: number]: any } = {};
    if (typeof datasets !== 'object') {
      return datasets;
    }

    let fromTime: number = from.getTime();
    for (let data of datasets) {
      for (let key in data) {
        let keyTime = parseInt(key);
        if (keyTime < fromTime) {
          continue;
        }
        let newKey: number = modes[modeKey].Aggregator(keyTime);
        if (newData[newKey]) {
          if (typeof newData[newKey] === 'number') {
            newData[newKey] += data[key];
          } else {
            // Add each value
            for (let valueKey in newData[newKey]) {
              newData[newKey][valueKey] += data[key][valueKey];
            }
          }
        } else {
          // No key yet, create one
          newData[newKey] = data[key];
        }
      }
    }
    return newData;
  }
  public static FormatRange(
    modeKey: string,
    datasets?: any[],
    previousRange?: { [timeKeyFormatted: string]: any }
  ): IFormatResult {
    let fromDate = new Date();
    let toDate = new Date(fromDate);
    modes[modeKey].Range(fromDate, toDate);

    // Unify key timestamps
    let adjustedData = this.TranslateDataKeys(modeKey, datasets, fromDate);

    // Make intervals
    let intervals: { [timeKeyFormatted: string]: any } = {};
    /* eslint-disable */
    while (fromDate <= toDate) {
      let time: number = fromDate.getTime()
      let timeFormatted: string = moment(fromDate).format(modes[modeKey].format)
      if (adjustedData && adjustedData[time]) {
        intervals[timeFormatted] = adjustedData[time]
      } else {
        intervals[timeFormatted] = null
      }
      modes[modeKey].Increment(fromDate)
    }
    /* eslint-enable */
    // Check if range is different from previous one
    if (previousRange && _.isEqual(intervals, previousRange)) {
      return null;
    }
    return { intervals, data: adjustedData };
  }
}
