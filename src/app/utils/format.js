export const formatDate = (date) => {
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  const formattedTime = `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
  return `${formattedDate} ${formattedTime}`;
};

export const formatOnlyDate = (date) => {
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  return `${formattedDate}`;
};
