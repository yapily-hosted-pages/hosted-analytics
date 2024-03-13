import moment from "moment";

export const createLookerUrl = (
  applicationId,
  startDate,
  endDate,
  institutionId
) => {
  const formatDate = (d, substractDays = 0) => {
    const date = moment(new Date(d));
    return encodeURIComponent(
      date.subtract(substractDays, "d").format("YYYY/MM/DD")
    );
  };

  const dateQueryParam = `Time+Filter+Date=${formatDate(
    startDate,
    1
  )}+to+${formatDate(endDate)}`;

  return `https://yapily.cloud.looker.com/dashboards/93?Client=&Application+Uuid=${
    applicationId || ""
  }&${dateQueryParam}&Banks=&Amount=&Payment+Type=&consent+Id=&Csm=&Institution+ID=${
    institutionId ? encodeURIComponent(institutionId) : ""
  }&Country+Code=&International+currency+of+transfer=&Pre+Auth+Flow+%28Yes+%2F+No%29=&Embedded+Flow+%28Yes+%2F+No%29=&Hosted+Flow=%22PAY_BY_LINK%22%2C%22PAY_NOW%22&Vertical=`;
};
