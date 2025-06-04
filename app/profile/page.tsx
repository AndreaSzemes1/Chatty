"use client";

import Navbar from "@/components/navbar";
import { useAuth } from "@/hooks/useAuth";
import { updatePassword } from "firebase/auth";
import { useState } from "react";

export default function Profile() {
  const { user, userName, updateUserName } = useAuth();

  const [name, setName] = useState(userName || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      if (name !== userName && name.trim() !== "") {
        await updateUserName(name);
        setMessage("Name updated successfully!");
      }

      if (password) {
        await updatePassword(user!, password);
        setMessage((prev) => prev + " Password updated successfully!");
      }

      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-lg w-full space-y-6">
          <h1 className="text-3xl font-bold text-center mb-4">Profile</h1>

          {message && (
            <div className="bg-green-100 text-green-800 p-2 rounded text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 text-red-800 p-2 rounded text-center">
              {error}
            </div>
          )}

          {/* Display Current Data */}
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg space-y-2">
            <p>
              <strong>Name:</strong> {userName}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || "N/A"}
            </p>
          </div>

          {/* Update Form */}
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                Update Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 p-2 rounded"
                placeholder="Enter new name"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                Update Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 p-2 rounded"
                placeholder="Enter new password"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 p-2 rounded"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
