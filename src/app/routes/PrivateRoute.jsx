// import { lazy } from 'react';
import Dayoff from "@pages/Dayoff/Dayoff.jsx";
import { ProtectedRoute } from "./ProtectedRoute/ProtectedRoute.jsx";
import Overview from "@pages/Overview/Overview.jsx";

const PrivateRoute = [
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "overview",
        element: <Overview />,
      },
      {
        path: "requests",
        children: [
          {
            path: "",
            element: <Dayoff />,
          },
        ],
      },
    ],
  },
];

export default PrivateRoute;
