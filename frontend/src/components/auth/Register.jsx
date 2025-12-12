import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { notifySuccess, notifyError } from "../alert/ToastContext";
import EyeIconShowPassword from "../icon/Eyeiconshowpassword";
import hotelVideo from "../../assets/video/hotel-video.mp4";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, username, email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      notifyError("Passwords do not match!");
      return;
    }

    const res = await register(formData);
    if (res.success) {
      notifySuccess("Registration Successful! Welcome to King of Asia.");
      navigate("/");
    } else {
      notifyError(res.error || "Registration Failed");
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center font-sans">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={hotelVideo} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      {/* Back Button */}
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

      <div className="relative z-10 w-full max-w-lg p-6 mx-4">
        <div className="text-center mb-6 animate-fade-in-up">
          <h2 className="text-3xl font-serif font-bold text-white tracking-wider">
            JOIN THE ROYALTY
          </h2>
          <p className="text-gray-300 text-sm mt-2">
            Create your account to unlock exclusive stays
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 animate-fade-in-up delay-100 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase mb-2 ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                className="w-full bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition placeholder-gray-400"
                placeholder="Your Full Name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Username */}
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
                  placeholder="Username"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-2 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  className="w-full bg-black/20 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition placeholder-gray-400"
                  placeholder="mail@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <EyeIconShowPassword
                label="Password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Create a strong password"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <EyeIconShowPassword
                label="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                placeholder="Re-enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition duration-300 transform hover:scale-[1.02] shadow-lg mt-4"
            >
              Register Now
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-amber-400 font-bold hover:text-amber-300 transition underline"
              >
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
