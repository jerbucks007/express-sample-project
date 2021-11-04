/**
* @function getDateComponents
* @description get a date components
* @param {Date} the date
* @return  {Object} all components of that date
*/
export const getDateComponents = (dateIn) => {
  const result = {
    date: dateIn.getDate(),
    month: dateIn.getMonth() + 1,
    year: dateIn.getFullYear(),
    hour: dateIn.getHours(),
    minute: dateIn.getMinutes(),
    second: dateIn.getSeconds(),
  };
  return result;
};
