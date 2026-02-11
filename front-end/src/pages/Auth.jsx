import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { loginRequest, registerRequest } from "../services/authService";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async () => {
    try {
      setError("");

      if (mode === "login") {
        const data = await loginRequest(email, password);
        login(data.user, data.token);
        toast.success("Welcome back");
      } else {
        const data = await registerRequest(name, email, password);
        login(data.user, data.token);
        toast.success("Welcome to DriveVerse 🚀");
      }

      // ❌ DO NOT navigate here
    } catch (err) {
      const message =
        err.message === "User already exists"
          ? "An account with this email already exists"
          : err.message === "Invalid credentials"
            ? "Invalid email or password"
            : "Something went wrong. Please try again.";

      toast.error(message);
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black px-6">
      {/* ✅ PREMIUM TOP & BOTTOM SPACING */}
      <div className="max-w-[490px] mx-auto pt-15 pb-">

        {/* CARD */}
        <div className="bg-white dark:bg-black
        
          rounded-xl p-8 ">

          {/* LOGO */}
          <Link to="/" className="block mb-8 leading-none">
            <p className="text-[18px] font-semibold text-black dark:text-white">
              Drive
            </p>
            <p className="text-[18px] font-semibold -mt-1 text-black dark:text-white">
              VERSE
            </p>
          </Link>

          {/* TITLE */}
          <h1 className="text-[28px] font-semibold text-black dark:text-white">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {mode === "login"
              ? "Please enter your details"
              : "Join DriveVerse to buy or sell with clarity"}
          </p>

          {/* ✅ GOOGLE LOGIN — LOGIN ONLY */}
          {mode === "login" && (
            <>
              <div className="mt-6">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const res = await fetch(
                        `${import.meta.env.VITE_API_URL}/api/auth/google`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            token: credentialResponse.credential,
                          }),
                        }
                      );

                      const data = await res.json();
                      login(data.user, data.token);
                      toast.success("Signed in with Google");
                      navigate("/", { replace: true });
                    } catch {
                      toast.error("Google login failed");
                    }
                  }}
                  onError={() => toast.error("Google login failed")}
                />
              </div>

              {/* DIVIDER */}
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>
            </>
          )}






          {/* FORM */}
          <div className="space-y-4">
            {mode === "register" && (
              <Input label="Full name" value={name} onChange={setName} />
            )}

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
            />

            <PasswordInput
              label="Password"
              value={password}
              onChange={setPassword}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 mt-3">{error}</p>
          )}

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            className="
              mt-6 w-full h-[44px]
              bg-black text-white
              dark:bg-white dark:text-black
              rounded-md font-medium
              hover:opacity-90 transition
            "
          >
            {mode === "login" ? "Sign in" : "Create account"}
          </button>

          {/* TOGGLE */}
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
            {mode === "login"
              ? "Don’t have an account?"
              : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-black dark:text-white font-medium"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* INPUT */
function Input({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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

/* PASSWORD */
function PasswordInput({ label, value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
          onClick={() => setShow(!show)}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            text-gray-500 dark:text-gray-400
            hover:text-black dark:hover:text-white
          "
        >
          {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </div>
  );
}
