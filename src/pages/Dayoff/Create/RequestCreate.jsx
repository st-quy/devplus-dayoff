import {
  Card,
  Drawer,
  Avatar,
  Select,
  Button,
  Segmented,
  DatePicker,
  Input,
  Form,
  Row,
  Col,
  message,
} from "antd";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useAddRequest } from "@app/hooks/useRequest";

const RequestCreate = ({ open, setOpen }) => {
  const [form] = Form.useForm(); // Use Form instance
  const dataUser = useSelector((state) => state.auth.user);
  const { mutate: addRequest, isPending: addLoading } = useAddRequest();
  const onClose = () => {
    setOpen(false);
  };

  const calculateQuantity = (values) => {
    const { dayoffType, dayoff } = values;
    if (!dayoff || dayoff.length < 2 || !dayoffType) return 0;

    const [start, end] = dayoff;
    const totalDays = dayjs(end).diff(dayjs(start), "day") + 1;

    if (dayoffType === "Full Day") {
      return totalDays;
    } else if (dayoffType === "Morning" || dayoffType === "Afternoon") {
      return totalDays / 2;
    }
    return 0;
  };

  const handleValueChange = (changedValues, allValues) => {
    if (changedValues.dayoff || changedValues.dayoffType) {
      const quantity = calculateQuantity(allValues);
      form.setFieldsValue({ quantity }); // Update the quantity field
    }
  };

  return (
    <Drawer
      title="CREATE NEW REQUEST"
      onClose={onClose}
      open={open}
      width={600}
    >
      <Form
        form={form} // Link the form instance
        onFinish={(values) => {
          addRequest(
            {
              action: "add",
              record: {
                "Full name": dataUser?.name,
                Department: values.department,
                "I would like to request...": values.requestType,
                "Day off from ... to ...(Example: morning 01/01/2025, afternoon 01/01/2025, 01/01/2025)":
                  (values.dayoffType === "Morning" ||
                    values.dayoffType === "Afternoon") &&
                  values.quantity <= 1
                    ? `${values.dayoffType} ${dayjs(values.dayoff[0]).format("DD/MM/YYYY")}`
                    : `${values.dayoffType} ${dayjs(values.dayoff[0]).format("DD/MM/YYYY")} - ${dayjs(values.dayoff[1]).format("DD/MM/YYYY")}`,
                "Reason OFF/WFH": values.reason.trim(),
                "Quantity (Example: morning 01/01/2025 = 0.5, 01/01/2025 = 1)":
                  values.quantity,
                Status: "",
                Timestamp: dayjs().format("MM/DD/YYYY HH:mm:ss"),
              },
            },
            {
              onSuccess: () => {
                setOpen(false);
                form.resetFields();
                message.success("Request created successfully!");
              },
            }
          );
        }}
        onValuesChange={handleValueChange} // Handle form value changes
        initialValues={{ quantity: 0, dayoffType: "Morning" }}
      >
        <Card bordered className="border-solid border-2 border-gray-300">
          <Card.Meta
            avatar={
              <Avatar
                src={
                  dataUser
                    ? dataUser.picture
                    : "https://api.dicebear.com/7.x/miniavs/svg?seed=8"
                }
                size={64}
              />
            }
            title={dataUser?.name || "User"}
            description={dataUser?.email || "staff@stunited.vn"}
          />
        </Card>

        <div className="mt-4 mb-2 font-semibold">
          Department <span className="text-red-500">*</span>
        </div>
        <Form.Item
          name="department"
          rules={[{ required: true, message: "Please select a department!" }]}
        >
          <Select
            className="w-full h-12"
            showSearch
            placeholder="Select a Department"
            optionFilterProp="label"
            options={[
              { value: "BO", label: "BO" },
              { value: "Developer", label: "Developer" },
              { value: "BA", label: "BA" },
              { value: "QA", label: "QA" },
              { value: "HR", label: "HR" },
              { value: "Marketing", label: "Marketing" },
              { value: "BD", label: "BD" },
            ]}
          />
        </Form.Item>

        <div className="mt-4 mb-2 font-semibold">
          I would like to request... <span className="text-red-500">*</span>
        </div>
        <Form.Item
          name="requestType"
          rules={[{ required: true, message: "Please select a request type!" }]}
        >
          <Select
            className="w-full h-12"
            showSearch
            placeholder="Select a request type"
            optionFilterProp="label"
            options={[
              { value: "OFF", label: "OFF" },
              { value: "WFH", label: "WFH" },
            ]}
          />
        </Form.Item>

        <div className="mt-4 mb-2 font-semibold">
          Choose the type of day off <span className="text-red-500">*</span>
        </div>
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item name="dayoffType">
              <Segmented
                options={["Morning", "Afternoon", "Full Day"]}
                className="w-full"
              />
            </Form.Item>

            <Form.Item
              name="dayoff"
              rules={[{ required: true, message: "Please select day!" }]}
            >
              <DatePicker.RangePicker
                className="w-full h-12"
                onChange={(date) => {
                  if (date === null) {
                    form.setFieldsValue({ quantity: 0 });
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <div className="mt-2 mb-6 font-semibold">
              Quantity <span className="text-red-500">*</span>
            </div>
            <Form.Item name="quantity">
              <Input
                className="w-full h-12"
                disabled
                classNames="disabled:!text-black !font-bold"
              />
            </Form.Item>
          </Col>
        </Row>

        <div className=" mb-2 font-semibold">
          Reason <span className="text-red-500">*</span>
        </div>
        <Form.Item
          name="reason"
          rules={[{ required: true, message: "Please provide a reason!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <div className="flex mt-4 gap-2">
          <Button
            color="default"
            variant="outlined"
            className="w-1/2 font-semibold"
            disabled={addLoading}
            onClick={() => {
              form.resetFields();
              setOpen(false);
            }} // Close drawer on reset
          >
            Reset
          </Button>
          <Button
            type="primary"
            className="w-1/2 bg-[#FF8A08] hover:!bg-[#FF7D29] font-bold"
            htmlType="submit"
            loading={addLoading}
          >
            Submit
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default RequestCreate;
