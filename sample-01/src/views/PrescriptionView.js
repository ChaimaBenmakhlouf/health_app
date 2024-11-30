import React, { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import PrescriptionCard from "../components/PrescriptionCard";

const PrescriptionView = () => {
  const { user, isAuthenticated } = useAuth0();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPrescriptions = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3001/get-prescriptions?email=${user.email}`);
      if (!response.ok) throw new Error("Failed to fetch prescriptions");
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const handleDeletePrescription = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/delete-prescription/${id}`, { method: "DELETE" });
      if (response.ok) {
        setPrescriptions((prev) => prev.filter((p) => p.id !== id));
      } else {
        throw new Error("Failed to delete prescription");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div>
      <h1>My Prescriptions</h1>
      <button onClick={() => navigate("/prescription/new")}>Add Prescription</button>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        prescriptions.map((prescription) => (
          <PrescriptionCard
            key={prescription.id}
            prescription={prescription}
            onDelete={handleDeletePrescription}
          />
        ))
      )}
    </div>
  );
};

export default PrescriptionView;
