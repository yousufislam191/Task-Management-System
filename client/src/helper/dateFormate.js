import moment from "moment/moment";

const dateFormate = (data) => {
  return moment(data).format("DD.MM.YYYY HH.mm");
};

export default dateFormate;
