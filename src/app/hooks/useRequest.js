import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RequestApi } from "@app/apis/requestApi"; // You'll need to create this
import { message } from "antd";
const useFetchAllRequest = () => {
  return useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const { data } = await RequestApi.getAll();
      return data.data;
    },
  });
};

const useUpdateRequest = () => {
  return useMutation({
    mutationFn: async (params) => {
      const { data } = await RequestApi.update(params);
      return data;
    },
    onError({ response }) {
      message.error(response.data.message);
    },
  });
};

const useAddRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      const { data } = await RequestApi.add(params);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["requests"]);
    },
    onError({ response }) {
      message.error(response.data.message);
    },
  });
};

export { useFetchAllRequest, useUpdateRequest, useAddRequest };
