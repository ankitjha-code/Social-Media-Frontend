import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";

const UserSubmissionForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    socialHandle: "",
    images: [],
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("socialHandle", formData.socialHandle);
    for (let i = 0; i < formData.images.length; i++) {
      data.append("images", formData.images[i]);
    }

    try {
      await axios.post(`${import.meta.env.VITE_URL}/submissions/add`, data);
      setStatus({ type: "success", message: "Submission successful!" });
      setFormData({ name: "", socialHandle: "", images: [] });
    } catch (error) {
      setStatus({ type: "error", message: "Error submitting form" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 py-12 px-4 flex items-center justify-center"
    >
      <motion.div whileHover={{ scale: 1.05 }} className="w-1/2 mx-auto">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">
              User Submission Form
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Social Media Handle
                </label>
                <Input
                  type="text"
                  value={formData.socialHandle}
                  onChange={(e) =>
                    setFormData({ ...formData, socialHandle: e.target.value })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Images
                </label>
                <Input
                  type="file"
                  onChange={(e) =>
                    setFormData({ ...formData, images: e.target.files })
                  }
                  multiple
                  accept="image/*"
                  className="mt-1"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full"
              >
                Submit
              </motion.button>
            </form>
            {status.message && (
              <Alert
                className={`mt-4 ${
                  status.type === "error" ? "bg-red-50" : "bg-green-50"
                }`}
              >
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default UserSubmissionForm;
