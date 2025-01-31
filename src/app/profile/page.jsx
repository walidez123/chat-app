"use client";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { authUser, checkAuth, isCheckingAuth, updateProfile } = useAuthStore();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      setName(authUser.name || "");
      setAvatar(authUser.profilePic || "");
    }
  }, [authUser]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setIsUpdating(true);
    try {
      await updateProfile({
        name,
        profilePic: selectedFile || avatar,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen bg-base-300 bg-opacity-50 flex items-center justify-center">
        <span className="loading loading-spinner text-white loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex text-white justify-center items-center h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Profile Settings</h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="avatar">
            <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {selectedFile || avatar ? (
                <img src={selectedFile || avatar} alt="Profile" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-500 flex items-center justify-center text-white">
                  No Image
                </div>
              )}
            </div>
          </div>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs mt-4"
            onChange={handleFileChange}
          />
        </div>

        {/* Name Input */}
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveChanges}
          className={`btn btn-primary mt-4 w-full ${
            isUpdating ? "loading" : ""
          }`}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Save Changes"}
        </button>

        {/* Go Home */}
        <Link
          href="/"
          className="text-base-content mt-2 underline hover:text-primary text-center block"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
