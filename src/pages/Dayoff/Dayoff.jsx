import { useEffect, useState } from "react";
import { Table, Tag, Tooltip, message, Button } from "antd";
import { CheckCircleOutlined, CloseSquareOutlined } from "@ant-design/icons";
import { useFetchAllRequest, useUpdateRequest } from "@app/hooks/useRequest";
import { useSlackNotification } from "@app/hooks/useSlack";
import { formatDate, formatOnlyDate } from "@app/utils/format";

const Dayoff = () => {
  const { data: requestList, isLoading } = useFetchAllRequest();
  const { mutate: updateRequest, isPending: updateLoading } =
    useUpdateRequest();
  const { mutate: sendNotification } = useSlackNotification();

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (requestList) {
      // Add a `loading` field to each record to track loading status
      setDataSource(
        requestList.reverse().map((record) => ({ ...record, loading: false }))
      );
    }
  }, [requestList]);

  const handleRequest = async (record, type) => {
    // Update the specific record's loading state to true
    setDataSource((prev) =>
      prev.map((item) =>
        item.rowNumber === record.rowNumber
          ? { ...item, loading: true } // Set loading to true for the clicked record
          : item
      )
    );

    try {
      updateRequest(
        {
          action: "update",
          rowNumber: record.rowNumber,
          updates: { Status: type },
        },
        {
          onSuccess: (data) => {
            if (data.status === 200) {
              setDataSource((prev) =>
                prev.map((item) =>
                  item.rowNumber === record.rowNumber
                    ? { ...item, Status: type, loading: false } // Update the record and set loading to false
                    : item
                )
              );
              sendNotification({ ...record, Status: type });
              message.success(`Successful Operation`);
            }
          },
          onError: () => {
            setDataSource((prev) =>
              prev.map((item) =>
                item.rowNumber === record.rowNumber
                  ? { ...item, loading: false } // If error occurs, set loading to false
                  : item
              )
            );
            message.error("An error occurred while updating the backend.");
          },
        }
      );
    } catch (error) {
      console.error("Error updating backend:", error);
      setDataSource((prev) =>
        prev.map((item) =>
          item.rowNumber === record.rowNumber
            ? { ...item, loading: false } // Set loading to false on error
            : item
        )
      );
      message.error("An error occurred while updating the backend.");
    }
  };

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "Timestamp",
      key: "Timestamp",
      width: 150,
      render: (text) => formatDate(new Date(text)),
    },
    {
      title: "Full Name",
      dataIndex: "Full name",
      key: "Full Name",
      width: 200,
    },
    {
      title: "Mentor",
      dataIndex: "Mentor",
      key: "Mentor",
      width: 150,
    },
    {
      title: "Day off",
      dataIndex: "Day off",
      key: "Day off",
      width: 200,
      render: (text) => formatOnlyDate(new Date(text)),
    },
    {
      title: "Duration:",
      dataIndex: "Duration:",
      key: "Duration:",
      width: 100,
    },
    {
      title: "Reason",
      dataIndex: "Reason OFF",
      key: "Reason OFF",
      width: 300,
      render: (text) => {
        return <p className="break-all">{text}</p>;
      },
    },
    {
      title: "",
      key: "Action",
      width: 150,
      fixed: "right",
      render: (_, record) =>
        record.Status ? (
          <Tag
            bordered={false}
            color={record.Status === "Approved" ? "success" : "error"}
            className="uppercase font-bold"
          >
            {record.Status}
          </Tag>
        ) : (
          <div
            className="flex gap-2"
            disabled={updateLoading}
            key={record.rowNumber}
          >
            <Tooltip title="Approve">
              <Button
                className="text-lg text-[#00a854] hover:!text-[#0d8e4d] cursor-pointer"
                type="outline"
                icon={<CheckCircleOutlined />}
                loading={record.loading} // Only show loading for the clicked record
                onClick={() => handleRequest(record, "Approved")}
                key={record.rowNumber}
              />
            </Tooltip>
            <Tooltip title="Reject">
              <Button
                className="text-lg text-[#ff0b0b] hover:text-[#8f1e1e] disabled:!text-gray-600 disabled:!cursor-not-allowed cursor-pointer "
                type="outline"
                icon={<CloseSquareOutlined />}
                disabled={record.loading} // Only show loading for the clicked record
                onClick={() => handleRequest(record, "Rejected")}
                key={record.rowNumber}
              />
            </Tooltip>
          </div>
        ),
    },
  ];

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: 1200 }}
        pagination={{
          pageSize: 10, // Customize the number of rows per page
          showSizeChanger: true, // Allow the user to change the page size
          pageSizeOptions: ["5", "10", "20", "50"], // Options for page size
        }}
        loading={isLoading}
        rowKey={(record) => record.rowNumber}
      />
    </>
  );
};

export default Dayoff;
