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

  // Styles en ligne ajoutés
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "auto",
      padding: "20px",
      backgroundColor: "#f7f7f7",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    header: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "2rem",
      color: "#333",
    },
    button: {
      padding: "10px 20px",
      margin: "10px 0",
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "1rem",
    },
    buttonError: {
      padding: "10px 20px",
      margin: "10px 0",
      backgroundColor: "#f44336",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "1rem",
    },
    error: {
      color: "#f44336",
      textAlign: "center",
    },
    prescriptionsList: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "20px",
      padding: "20px",
    },
    noPrescriptionsMessage: {
      textAlign: "center",
      fontSize: "1.2rem",
      color: "#555",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Mes Prescriptions</h1>
      <button onClick={() => navigate("/prescription/new")} style={styles.button}>
        Ajouter
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div style={styles.error}>
          <p>Error: {error}</p>
          <button style={styles.buttonError} onClick={() => fetchPrescriptions()}>
            Réessayer
          </button>
        </div>
      ) : prescriptions.length === 0 ? (
        <p style={styles.noPrescriptionsMessage}>Pas de prescription trouvées</p>
      ) : (
        <div style={styles.prescriptionsList}>
          {prescriptions.map((prescription) => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
              onDelete={handleDeletePrescription}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PrescriptionView;
