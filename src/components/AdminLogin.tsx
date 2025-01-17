import { useState, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import axios, { AxiosError } from "axios";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { useNavigate } from "react-router-dom";

interface Credentials {
  username: string;
  password: string;
}

interface ErrorResponse {
  message: string;
}

const AdminLogin = () => {
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/admin/login`,
        credentials
      );
      localStorage.setItem("adminToken", response.data.token);
      navigate("/admin/dashboard");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponse>;
      setError(axiosError.response?.data?.message || "Invalid credentials");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 py-12 px-4 flex items-center justify-center"
    >
      <motion.div whileHover={{ y: -5, scale: 1.02 }} className="w-1/2 mx-auto">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">Admin Login</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <Input
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full"
              >
                Login
              </motion.button>
              {error && (
                <Alert className="mt-4 bg-red-50">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminLogin;
