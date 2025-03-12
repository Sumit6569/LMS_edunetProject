import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { name, email, password, password2 } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during registration"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-white">
          Create your account
        </h2>
        {error && <div className="text-red-500 text-center">{error}</div>}

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <Input
            type="text"
            name="name"
            placeholder="Full name"
            value={name}
            onChange={onChange}
          />
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={email}
            onChange={onChange}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
          />
          <Input
            type="password"
            name="password2"
            placeholder="Confirm password"
            value={password2}
            onChange={onChange}
          />

          <Button
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
            type="submit"
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
