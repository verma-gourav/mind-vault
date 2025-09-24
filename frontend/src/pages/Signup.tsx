import { InputField } from "../components/ui/InputField";
import { Logo } from "../icons/Logo";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/api/v1/signup`, {
        username,
        password,
      });

      alert("Signup successful:");
      navigate("/signin"); // smooth navigation
    } catch (error: any) {
      console.error("Signup failed:", error.response?.data || error.message);
      alert(`Signup failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn min-h-screen flex flex-col items-center justify-center p-4 bg-blue-50">
      {/* Logo + Name */}
      <div className="flex flex-col items-center gap-2 mb-8 sm:flex-row sm:gap-4">
        <div className="text-blue-600">
          <Logo size="xl" />
        </div>
        <h1 className="text-2xl font-bold">Mind Vault</h1>
      </div>

      {/* Signup Form */}
      <div className="bg-blue-100 rounded-xl p-6 shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex justify-center mb-4">
          <h2 className="text-xl font-medium">Sign Up</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputField
            label="Password"
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Submit */}
          <div className="flex justify-center mt-4">
            <Button
              variant="primary"
              size="md"
              text="SUBMIT"
              loading={loading}
              className="w-full sm:w-32"
            />
          </div>
        </form>
      </div>

      {/* Already have account */}
      <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-2 text-sm">
        <span className="text-gray-400">Already have an account?</span>
        <Button
          variant="secondary"
          size="sm"
          text="Sign In"
          onClick={() => navigate("/signin")}
        />
      </div>
    </div>
  );
};
