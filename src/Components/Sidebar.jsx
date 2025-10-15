import React from "react";
import "./StyleCss/Sidebar.css";
import { FaHome, FaCubes, FaBuilding } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
    { icon: <FaCubes />, label: "Leads", path: "/leads" },
    { icon: <FaBuilding />, label: "Total Offices", path: "/office" },
    { icon: <FaBuilding />, label: "Country", path: "/country" },
  ];

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <div className={`admin-sidebar ${isOpen ? "open" : "collapsed"}`}>
      <ul>
        {menu.map((item, i) => {
          const isActive = location.pathname === item.path;
          return (
            <li
              key={i}
              className={`sidebar-item ${isActive ? "active" : ""}`}
              onClick={() => handleItemClick(item.path)}
            >
              <span className="admin-icon">{item.icon}</span>
              <span className="admin-label">{item.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
