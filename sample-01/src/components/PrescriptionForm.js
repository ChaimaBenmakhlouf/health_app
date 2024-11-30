import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";

const PrescriptionForm = () => {
  const { user } = useAuth0();
  const { id } = useParams(); // Récupère l'ID de l'URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    medication_name: "",
    dosage_quantity: "",
    dosage_frequency: "Tous les jours",
    dosage_duration_value: "",
    dosage_duration_unit: "jours",
    start_date: "",
    end_date: "", 
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      console.log("Fetching prescription for ID:", id);
      fetch(`http://localhost:3001/get-prescription/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Erreur lors de la récupération des données");
          }
          return res.json();
        })
        .then((data) => {
          console.log("Données récupérées :", data);
          const [durationValue, durationUnit] = data.dosage_duration.split(" ");
          setFormData({
            medication_name: data.medication_name,
            dosage_quantity: data.dosage_quantity,
            dosage_frequency: data.dosage_frequency,
            dosage_duration_value: durationValue,
            dosage_duration_unit: durationUnit,
            start_date: data.start_date ? data.start_date.slice(0, 10) : "",
            end_date: data.end_date ? data.end_date.slice(0, 10) : "", 
            notes: data.notes || "",
          });
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors du chargement des données :", error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = id
      ? `http://localhost:3001/update-prescription/${id}`
      : "http://localhost:3001/save-prescription";

    const method = id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dosage_duration: `${formData.dosage_duration_value} ${formData.dosage_duration_unit}`,
          user_email: user.email,
        }),
      });

      if (response.ok) {
        navigate("/prescriptions");
      } else {
        throw new Error("Échec de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    }
  };

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? "Modifier une prescription" : "Ajouter une prescription"}</h2>
      <div className="form-group">
        <label>Nom du médicament</label>
        <input
          type="text"
          name="medication_name"
          value={formData.medication_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Quantité à prendre</label>
        <input
          type="number"
          name="dosage_quantity"
          value={formData.dosage_quantity}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Fréquence</label>
        <select
          name="dosage_frequency"
          value={formData.dosage_frequency}
          onChange={handleChange}
          required
        >
          <option value="Tous les jours">Tous les jours</option>
          <option value="Tous les deux jours">Tous les deux jours</option>
          <option value="Une fois par semaine">Une fois par semaine</option>
        </select>
      </div>
      <div className="form-group">
        <label>Durée du traitement</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="number"
            name="dosage_duration_value"
            value={formData.dosage_duration_value}
            onChange={handleChange}
            required
          />
          <select
            name="dosage_duration_unit"
            value={formData.dosage_duration_unit}
            onChange={handleChange}
            required
          >
            <option value="jours">Jours</option>
            <option value="mois">Mois</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Date de début</label>
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
      <label>Date de fin</label>
      <input
        type="date"
        name="end_date"
        value={formData.end_date}
        onChange={handleChange}
      />
        </div>
      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
        />
      </div>
{/* Boutons Sauvegarder et Retour */}
<div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button type="submit">{id ? "Modifier" : "Sauvegarder"}</button>
        <button type="button" onClick={() => navigate("/prescriptions")}>
          Retour
        </button>
      </div>    </form>
  );
};

export default PrescriptionForm;
