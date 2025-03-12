import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { motion } from "framer-motion";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-96 shadow-xl rounded-2xl p-6 bg-white">
          <CardContent>
            <h1 className="text-2xl font-bold text-center mb-4">
              Welcome Back!
            </h1>
            <p className="text-gray-500 text-center mb-6">Login to continue</p>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={setEmail}
                className="w-full p-3 border rounded-lg"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={setPassword}
                className="w-full p-3 border rounded-lg"
              />
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 rounded-lg"
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Don’t have an account?{" "}
              <a href="#" className="text-blue-500">
                Sign up
              </a>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginComponent;
