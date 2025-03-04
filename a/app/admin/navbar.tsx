"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  username: string;
}

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:1337/api/users/me");
        setUser(response.data); // เก็บข้อมูลผู้ใช้ทั้งหมด (object)
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
          <span className="text-white font-medium">{user ? ` ${user.username}` : "Loading..."}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
