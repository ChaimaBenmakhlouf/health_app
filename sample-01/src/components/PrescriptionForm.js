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
      fetch(`http://localhost:3001/get-prescription/${id}`)
        .then((res) => res.json())
        .then((data) => {
          const [durationValue, durationUnit] = data.dosage_duration.split(" ");
          setFormData({
            medication_name: data.medication_name,
            dosage_quantity: data.dosage_quantity,
            dosage_frequency: data.dosage_frequency,
            dosage_duration_value: durationValue,
            dosage_duration_unit: durationUnit,
            start_date: data.start_date.slice(0, 10),
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

  // Styles en ligne ajoutés
  const styles = {
    form: {
      maxWidth: "600px", // Largeur maximale du formulaire
      margin: "auto", // Centrer le formulaire sur la page
      padding: "20px", // Padding interne pour espacer les éléments
      backgroundColor: "#f9f9f9", // Fond clair
      borderRadius: "8px", // Bordures arrondies
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Ombre légère pour donner de la profondeur
    },
    input: {
      width: "100%", // Prendre toute la largeur disponible
      padding: "10px", // Padding pour améliorer l'expérience utilisateur
      marginBottom: "10px", // Marge inférieure pour espacer les champs
      borderRadius: "5px", // Bordures arrondies
      border: "1px solid #ccc", // Bordure subtile
    },
    select: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      marginTop: "10px",
    },
    saveButton: {
      backgroundColor: "#4CAF50", // Bouton "Sauvegarder" en vert
      color: "#fff", // Texte blanc
    },
    backButton: {
      backgroundColor: "#f44336", // Bouton "Retour" en rouge
      color: "#fff", // Texte blanc
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>{id ? "Modifier une prescription" : "Pour ajouter une prescription"}</h2>
      <div className="form-group">
        <label>Nom du médicament</label>
        <input
          type="text"
          name="medication_name"
          value={formData.medication_name}
          onChange={handleChange}
          style={styles.input}
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
          style={styles.input}
          required
        />
      </div>
      <div className="form-group">
        <label>Fréquence</label>
        <select
          name="dosage_frequency"
          value={formData.dosage_frequency}
          onChange={handleChange}
          style={styles.select}
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
            style={styles.input}
            required
          />
          <select
            name="dosage_duration_unit"
            value={formData.dosage_duration_unit}
            onChange={handleChange}
            style={styles.select}
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
          style={styles.input}
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
          style={styles.input}
        />
      </div>
      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          style={styles.input}
        />
      </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button type="submit" style={{ ...styles.button, ...styles.saveButton }}>
          {id ? "Modifier" : "Sauvegarder"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/prescriptions")}
          style={{ ...styles.button, ...styles.backButton }}
        >
          Retour
        </button>
      </div>
    </form>
  );
};

export default PrescriptionForm;