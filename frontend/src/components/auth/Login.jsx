import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { notifySuccess, notifyError } from "../alert/ToastContext";
import EyeIconShowPassword from "../icon/Eyeiconshowpassword";
import hotelVideo from "../../assets/video/hotel-video.mp4";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { username, password } = formData;

  // Handle input changes
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await login(username, password);
    if (res.success) {
      notifySuccess("Login Successful! Welcome back.");
    } else {
      notifyError(res.error || "Login Failed");
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center font-sans">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={hotelVideo} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>

      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20 text-white/80 hover:text-amber-400 transition flex items-center gap-2 font-medium text-sm bg-black/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 hover:bg-black/40"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Back to Home
      </button>

      {/* Login Card Container */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4">
        {/* Brand Logo */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="text-4xl font-serif font-bold text-white tracking-wider drop-shadow-lg">
            KING OF ASIA
          </h2>
          <p className="text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mt-2">
            Luxury Hotel & Resort
          </p>
        </div>

        {/* Glass Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 animate-fade-in-up delay-100">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Welcome Back
          </h2>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-2 ml-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={onChange}
                className="w-full bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition placeholder-gray-400"
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password Input  */}
            <div>
              <EyeIconShowPassword
                label="Password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition duration-300 transform hover:scale-[1.02] shadow-lg mt-4"
            >
              Sign In
            </button>
          </form>

          {/* Link to Register */}
          <div className="mt-8 text-center">
            <p className="text-gray-300 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-amber-400 font-bold hover:text-amber-300 transition underline"
              >
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
