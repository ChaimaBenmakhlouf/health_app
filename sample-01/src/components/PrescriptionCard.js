import React from "react";
import { Link } from "react-router-dom";

const PrescriptionCard = ({ prescription, onDelete }) => {
  return (
    <div className="prescription-card" style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
      <h3>{prescription.medication_name}</h3>
      <p><strong>Quantité à prendre :</strong> {prescription.dosage_quantity}</p>
      <p><strong>Fréquence :</strong> {prescription.dosage_frequency}</p>
      <p><strong>Durée du traitement :</strong> {prescription.dosage_duration}</p>
      <p><strong>Date de début :</strong> {new Date(prescription.start_date).toLocaleDateString()}</p>
      <p><strong>Date de fin :</strong>  {prescription.end_date && prescription.end_date !== "" 
    ? new Date(prescription.end_date).toLocaleDateString() 
    : "Non spécifiée"}</p>
      <p><strong>Notes :</strong> {prescription.notes || "Aucune note"}</p>
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <Link to={`/prescription/edit/${prescription.id}`}>
          <button>Modifier</button>
        </Link>
        <button onClick={() => onDelete(prescription.id)}>Supprimer</button>
      </div>
    </div>
  );
};

export default PrescriptionCard;
