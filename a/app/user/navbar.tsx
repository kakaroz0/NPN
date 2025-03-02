"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const Navbar: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:1337/api/users/me");
        setUserName(response.data.username);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <nav className="bg-gray-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">NPN App</h1>
        <div className="space-x-4 flex items-center">
          <span className="text-white font-medium">{userName ? ` ${userName}` : "Loading..."}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
