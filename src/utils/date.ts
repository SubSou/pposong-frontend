export const formatDateTime = (dateString: string): string => {
  if (!dateString) return "";

  const [date, time] = dateString.split("T");

  if (!date || !time) return dateString;

  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":");

  return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
};
