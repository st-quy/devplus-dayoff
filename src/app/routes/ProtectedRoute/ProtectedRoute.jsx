import { Layout, Menu, Typography, Affix, Button } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  ClusterOutlined,
  LogoutOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import logo from "@assets/Images/devplus.png";
import { logout } from "@app/features/auth/authSlice";
import RequestCreate from "@pages/Dayoff/Create/RequestCreate";

const { Content, Sider, Header } = Layout;

export const ProtectedRoute = () => {
  const isAuth = localStorage.getItem("access_token");
  const dataUser = useSelector((state) => state.auth.user);
  const dispatchAuth = useDispatch();
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const getActiveKey = (path) => path.split("/")[1];

  const [activeKey, setActiveKey] = useState(getActiveKey(pathname));

  const changeTab = (key) => {
    setActiveKey(key);
    navigate(`/${key}`);
  };

  useEffect(() => {
    setActiveKey(getActiveKey(pathname));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    dispatchAuth(logout());
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth]);

  return (
    <Layout id="layout-container" className="h-screen">
      <Sider
        className="!bg-[#FFFFFF] z-10 p-4 font-medium [&_.ant-layout-sider-trigger]:!bg-[#b3b3b3] [&_.ant-layout-sider-trigger]:!left-0 [&_.ant-layout-sider-trigger]:!bottom-0  [&_.ant-layout-sider-trigger]:!text-white"
        collapsedWidth={100}
        breakpoint="lg"
      >
        <div className="flex justify-center items-center m-4 gap-2">
          <img src={logo} alt="logo" className="w-14 h-14 cursor-pointer" />
        </div>
        <Menu
          theme="dark"
          mode="vertical"
          selectedKeys={[activeKey]}
          onClick={({ key }) => changeTab(key)}
          className="!bg-transparent border-none [&_.ant-menu-item-selected]:!bg-[#F5F7F9] [&_.ant-menu-item]:!text-[#121212]"
          items={[
            { key: "overview", icon: <HomeOutlined />, label: "Overview" },
            {
              key: "requests",
              icon: <ClusterOutlined />,
              label: "List Request",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header className="bg-white flex justify-between items-center p-4 shadow-md">
          {dataUser && <div>Welcome back, {dataUser.name || ""}</div>}
          <LogoutOutlined
            className="cursor-pointer hover:text-red-500"
            onClick={handleLogout}
          />
        </Header>
        <div className="bg-gradient-to-r from-[#212121]  to-[#424242] !relative rounded-xl -bottom-8 z-50 mx-10">
          <Typography.Title
            level={5}
            className="p-6 !text-white flex items-center justify-between !mb-0 capitalize"
          >
            {activeKey}
          </Typography.Title>
        </div>
        <Content
          className={`m-4 !mt-0 !pt-10 p-6 !bg-white shadow-sm rounded-lg overflow-auto`}
        >
          <Outlet />
        </Content>
        <Affix style={{ position: "fixed", bottom: 16, right: 16 }}>
          <Button
            type="outline"
            shape="circle"
            icon={<PlusOutlined />}
            size="large"
            className="bg-[#FF8A08] hover:bg-[#FF7D29] text-white shadow-md !w-14 h-14"
            onClick={() => setOpen(true)}
          />
        </Affix>
        <RequestCreate setOpen={setOpen} open={open} />
      </Layout>
    </Layout>
  );
};
