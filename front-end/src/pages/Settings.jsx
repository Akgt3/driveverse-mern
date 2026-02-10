import { useState } from "react";
import { FiLock, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { changePasswordRequest } from "../services/userService";


export default function Settings() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await changePasswordRequest(
        form.currentPassword,
        form.newPassword
      );

      toast.success("Password updated successfully");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.message);
    }
  };
  const { user } = useAuth();


  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors pt-18">
      <div className="max-w-[900px] mx-auto px-6 py-16">

        {/* HEADER */}
        <h1 className="text-[36px] font-semibold text-black dark:text-white">
          Settings
        </h1>
        <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 max-w-[620px]">
          Manage your account security and update your password.
        </p>

        {/* CARD */}
        <div
          className="
            mt-12
            bg-white dark:bg-[#0F0F0F]
            border border-gray-200 dark:border-[#333333]
            rounded-lg
            p-6
            max-w-[520px]
          "
        >
          <div className="flex items-center gap-3 mb-6 text-black dark:text-white">
            <FiLock />
            <h2 className="text-[18px] font-semibold">
              Change Password
            </h2>
          </div>

          {/* FORM */}
          <div className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={form.currentPassword}
              onChange={(e) =>
                handleChange("currentPassword", e.target.value)
              }
            />

            <Input
              label="New Password"
              type="password"
              value={form.newPassword}
              onChange={(e) =>
                handleChange("newPassword", e.target.value)
              }
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                handleChange("confirmPassword", e.target.value)
              }
            />
          </div>

          {/* CTA */}
          <button
            onClick={handleSave}
            className="
              mt-6
              w-full sm:w-auto
              px-8 py-3 rounded-lg
              bg-black text-white
              dark:bg-white dark:text-black
              text-sm font-medium
              flex items-center justify-center gap-2
            "
          >
            <FiCheckCircle />
            Update Password
          </button>

          <p className="mt-3 text-xs text-gray-500 dark:text-neutral-400">
            * Demo only. Password update will be connected to backend later.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- INPUT COMPONENT ---------- */

function Input({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 dark:text-neutral-400 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="
          w-full px-4 py-3 rounded-md
          border border-gray-300 dark:border-[#333333]
          bg-white dark:bg-[#121212]
          text-black dark:text-white
          outline-none
          focus:border-black dark:focus:border-white
        "
      />
    </div>
  );
}
