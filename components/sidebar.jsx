"use client"
import { useState } from "react";
import { RiChat3Line, RiSettings4Line, RiQuestionLine } from "react-icons/ri";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("chats");

  const menuItems = [
    { id: "chats", icon: RiChat3Line, label: "Chats" },
    { id: "help", icon: RiQuestionLine, label: "Help & FAQ" },
    { id: "settings", icon: RiSettings4Line, label: "Settings" },
  ];

  const handleItemClick = (id) => {
    setActiveItem(id);
  };

  return (
    <div className="w-64 bg-amber-100 text-gray-800 flex flex-col">
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                  activeItem === item.id
                    ? "bg-amber-200 text-gray-900"
                    : "hover:bg-amber-200 hover:text-gray-900"
                }`}
                onClick={() => handleItemClick(item.id)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;