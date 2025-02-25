import axios from "axios";
import { formatOnlyDate } from "../utils/format.js";

export const SlackApi = {
  send: async (record) => {
    try {
      await axios.post(
        "https://slack.com/api/chat.postMessage",
        {
          token: import.meta.env.VITE_SLACK_TOKEN,
          channel: import.meta.env.VITE_SLACK_CHANNEL,
          text: "Request OFF Notification",
          blocks: `[
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*@channel Request Notification*",
              },
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: "*Name:*\n${record["Full name"]}",
                },
                {
                  type: "mrkdwn",
                  text: "*Mentor:*\n${record["Mentor"]}",
                },
                {
                  type: "mrkdwn",
                  text: "*Date:*\n${formatOnlyDate(new Date(record["Day off"]))}",
                },
                {
                  type: "mrkdwn",
                  text: "*Duration:*\n${record["Duration:"]}",
                },
                {
                  type: "mrkdwn",
                  text: "*Reason:*\n${record["Reason OFF"]}",
                },
                {
                  type: "mrkdwn",
                  text: "*Status:*\n${record["Status"]}",
                },
              ],
            },
            {
              type: "divider",
            },
          ]`,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
    } catch (error) {
      console.error("Error sending message to Slack:", error);
    }
  },
};
