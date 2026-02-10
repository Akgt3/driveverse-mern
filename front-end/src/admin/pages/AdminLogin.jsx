import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleAdminLogin = async () => {
    try {
      const res = await fetch("${import.meta.env.VITE_API_URL}/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      login(data.user, data.token);
      navigate("/admin", { replace: true });

    } catch (err) {
      alert(err.message || "Admin login failed");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-[420px]">

        {/* LOGO */}
        <Link to="/" className="block mb-10 leading-none">
          <p className="text-[18px] font-semibold text-black dark:text-white">
            Drive
          </p>
          <p className="text-[18px] font-semibold -mt-1 text-black dark:text-white">
            VERSE
          </p>
        </Link>

        {/* TITLE */}
        <h1 className="text-[28px] font-semibold text-black dark:text-white">
          Admin Login
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Sign in to manage DriveVerse platform
        </p>

        {/* FORM */}
        <div className="space-y-4 mt-6">
          <Input label="Admin Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />

          {/* PASSWORD WITH EYE */}
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
    w-full h-[44px] px-4 pr-12
    border border-gray-300 dark:border-gray-700
    rounded-md
    bg-white dark:bg-black
    text-black dark:text-white
    outline-none
    focus:border-black dark:focus:border-white
  "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  text-gray-500 hover:text-black
                  dark:hover:text-white
                "
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleAdminLogin}
          className="
            mt-6 w-full h-[44px]
            bg-black text-white
            dark:bg-white dark:text-black
            rounded-md
            font-medium
            hover:opacity-90 transition
          "
        >
          Sign in as Admin
        </button>

        {/* BACK */}
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
          Not an admin?{" "}
          <Link
            to="/auth"
            className="text-black dark:text-white font-medium"
          >
            User login
          </Link>
        </p>
      </div>
    </div>
  );
}

/* SIMPLE INPUT */
function Input({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="
          w-full h-[44px] px-4
          border border-gray-300 dark:border-gray-700
          rounded-md
          bg-white dark:bg-black
          text-black dark:text-white
          outline-none
          focus:border-black dark:focus:border-white
        "
      />
    </div>
  );
}
