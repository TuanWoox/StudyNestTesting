import React from "react";
import { Outlet } from "react-router-dom";

const CenterLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-pink-500 p-4">
      <Outlet />
    </div>
  );
};

export default CenterLayout;
