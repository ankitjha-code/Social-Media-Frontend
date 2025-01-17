import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios, { AxiosError } from "axios";
import { Card, CardContent, CardHeader } from "./ui/card";

interface Submission {
  _id: string;
  name: string;
  socialHandle: string;
  images: string[];
}

const AdminDashboard = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_URL}/submissions/get`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSubmissions(response.data);
        setLoading(false);
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        console.error("Error fetching submissions:", axiosError.message);
        setLoading(false);
        if (axiosError.response?.status === 401) {
          navigate("/admin/login");
        }
      }
    };

    fetchSubmissions();
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 py-12 px-4 flex items-center justify-center"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Admin Dashboard
        </h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {submissions.map((submission) => (
              <motion.div
                key={submission._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">{submission.name}</h3>
                    <p className="text-gray-600">{submission.socialHandle}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {submission.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
