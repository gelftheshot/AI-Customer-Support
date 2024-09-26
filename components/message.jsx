import React from 'react'
import { FaUser } from "react-icons/fa";
import { FaRobot } from "react-icons/fa";

const Message = ({ role, content }) => {
  return (
    <div className={`flex flex-col ${role === 'user' ? 'items-end' : 'items-start'} mb-4`}>
      <div className={`flex items-center ${role === 'user' ? 'flex-row-reverse' : 'flex-row'} mb-2`}>
        {role === 'user' ? 
          <FaUser className="text-xl md:text-2xl text-purple-600 ml-2" /> : 
          <FaRobot className="text-xl md:text-2xl text-indigo-600 mr-2" />
        }
        <span className="text-xs md:text-sm text-gray-500 font-medium">{role === 'user' ? 'You' : 'AI Assistant'}</span>
      </div>
      <div className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl ${role === 'user' ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800' : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'}`}>
        <div className="text-sm md:text-base">{content}</div>
      </div>
    </div>
  )
}

export default Message