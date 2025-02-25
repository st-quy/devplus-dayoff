import { useMutation } from "@tanstack/react-query";
import { SlackApi } from "@app/apis/slackAPI"; // You'll need to create this
import { message } from "antd";

const useSlackNotification = () => {
  return useMutation({
    mutationFn: async (params) => {
      const { data } = await SlackApi.send(params);
      return data;
    },
    onError({ response }) {
      message.error(response.data.message);
    },
  });
};

export { useSlackNotification };
