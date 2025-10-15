import React, { useEffect, useState } from "react";
import "../CSS/FullLeadPage.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { ToastContainer } from 'react-toastify';
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { toast } from "react-toastify";

const FullLeadPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formId = location.state?.formId || location.state;
  const API_URL = import.meta.env.VITE_API_URL;

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-GB");

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // modal state
  const [showVisaModal, setShowVisaModal] = useState(false);
  const [applyInOffice, setApplyInOffice] = useState(null);
  const [visaDate, setVisaDate] = useState(null);
  const [adminCharge, setAdminCharge] = useState("");
  const [saving, setSaving] = useState(false);

  
  const [offices, setOffices] = useState([]);

  
  const fetchClientForm = async () => {
    try {
      if (!formId) {
        throw new Error("No form ID provided");
      }

      const res = await axios.get(`${API_URL}/api/client-form/getbyid/${formId}`);

      if (!res.data) {
        throw new Error("No data received from server");
      }
      console.log(res);

      setFormData(res.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching client form:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch client form";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // fetch offices
  const fetchOffices = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/office/all`);
      if (res.data && Array.isArray(res.data)) {
        const options = res.data.map((o) => ({
          label: `${o.officeName} (${o.country})`,
          value: o._id,
        }));
        setOffices(options);
      } else {
        console.warn("No offices data received");
        setOffices([]);
      }
    } catch (error) {
      console.error("Error fetching offices:", error);
      toast.error("Failed to fetch offices");
      setOffices([]);
    }
  };

  useEffect(() => {
    fetchClientForm();
    fetchOffices();
  }, [formId]);

  const handleApplyVisa = () => {
    if (!formId) {
      toast.error("No form ID available");
      return;
    }
    setShowVisaModal(true);
  };

  const handleUpdateVisa = () => {
    if (!formId) {
      toast.error("No form ID available");
      return;
    }
    setShowVisaModal(true);
  };

  const handleSaveVisa = async () => {
    try {
      setSaving(true);
      
      if (formData.isVisaApply === false) {
        // Apply for new visa - send all data
        const visaData = {
          formId,
          officeId: applyInOffice,
          visaDate: visaDate.toISOString(),
          adminCharge: adminCharge.trim(),
        };
        console.log("Applying new visa:", visaData);
        await axios.put(`${API_URL}/api/client-form/update-visa`, visaData);
        toast.success("Visa applied successfully!");
      } else {
        const updateData = {
          formId,
          visaDate: visaDate.toISOString(),
        };
        console.log("Updating visa date:", updateData);
        await axios.put(`${API_URL}/api/client-form/update-visa-date`, updateData);
        toast.success("Visa date updated successfully!");
      }

      // Reset form and refresh data
      setShowVisaModal(false);
      setAdminCharge("");
      setVisaDate(null);
      setApplyInOffice(null);
      
      // Refresh the form data
      await fetchClientForm();
      
    } catch (error) {
      console.error("❌ Failed to save visa details:", error);
      const errorMessage = error.response?.data?.message || "Failed to save visa details";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowVisaModal(false);
    setAdminCharge("");
    setVisaDate(null);
    setApplyInOffice(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB");
    } catch {
      return "Invalid Date";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <ProgressSpinner />
        <p>Loading client details...</p>
      </div>
    );
  }

  // Error state
  if (error || !formData) {
    return (
      <div className="error-container">
        <p>{error || "Client form not found!"}</p>
        <button onClick={() => navigate(-1)} className="back-button">← Back</button>
      </div>
    );
  }

  // Safe data access helpers
  const getOfficeConfirmation = (path, defaultValue = "") => {
    try {
      const value = path.split('.').reduce((obj, key) => obj?.[key], formData);
      return value || defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Get visa office details from formData
  const getVisaOffice = () => {
    return formData.officeId || null;
  };

  return (
    <div className="form-container">
      {/* Navigation Header */}
      <div className="navigation-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back to Leads
        </button>
      </div>

      {/* Company Header */}
      <div className="company-header">
        <div>
          <h2>Chhaya International Pvt. Ltd.</h2>
          <p>
            LIG 2 Nirala Nagar Unnao
            <br />
            Uttar Pradesh 209801
          </p>
          <p>Email: chhayainternationalpvtltd@gmail.com</p>
          <p>Contact No.: 8081478307</p>
        </div>
        <img
          src="logo.jpg"
          alt="Company Logo"
          className="company-logo"
          style={{ width: "30%" }}
        />
      </div>

      {/* Client Photo & Signature */}
      <div className="photo-signature-top">
        <div className="photo-box">
          <label>Client Photo</label>
          <img
            src={formData.photo}
            alt="Client"
            className="photo-img"
            onError={(e) => {
              e.target.src = '/default-avatar.png';
            }}
          />
        </div>
        <div className="signature-box">
          <label>Client Signature</label>
          <img
            src={formData.Sign}
            alt="Signature"
            className="signature-img"
            onError={(e) => {
              e.target.src = '/default-signature.png';
            }}
          />
        </div>
      </div>

      <h3 className="form-title-client">Registration Form</h3>

      {/* Form Content */}
      <form>
        <div className="flex-row space-between">
          <label>Date: {formattedDate}</label>
          <label>Reg No.: {formData.regNo || "N/A"}</label>
        </div>

        {/* Personal Details */}
        <h4>● Personal Details</h4>
        <div className="grid-2">
          <label>
            Full Name: <input type="text" value={formData.fullName || ""} readOnly />
          </label>
          <label>
            Father Name: <input type="text" value={formData.fatherName || ""} readOnly />
          </label>
          <label>
            Date of Birth: <input type="date" value={formData.dateOfBirth || ""} readOnly />
          </label>
          <label>
            Address: <input type="text" value={formData.address || ""} readOnly />
          </label>
          <label>
            State: <input type="text" value={formData.state || ""} readOnly />
          </label>
          <label>
            PIN Code: <input type="text" value={formData.pinCode || ""} readOnly />
          </label>
          <label>
            Contact No.: <input type="text" value={formData.contactNo || ""} readOnly />
          </label>
          <label>
            WhatsApp Number: <input type="text" value={formData.whatsAppNo || ""} readOnly />
          </label>
          <label>
            Family Contact: <input type="text" value={formData.familyContact || ""} readOnly />
          </label>
          <label>
            Email: <input type="email" value={formData.email || ""} readOnly />
          </label>
        </div>

        {/* Passport Details */}
        <h4>● Passport Details</h4>
        <div className="grid-2">
          <label>
            Passport Number: <input type="text" value={formData.passportNumber || ""} readOnly />
          </label>
          <label>
            Passport Issue: <input type="date" value={formData.passportIssue || ""} readOnly />
          </label>
          <label>
            Passport Expiry: <input type="date" value={formData.passportExpiry || ""} readOnly />
          </label>
          <label>
            Nationality: <input type="text" value={formData.nationality || "Indian"} readOnly />
          </label>

          <div className="checkbox-row">
            <label>
              <input type="radio" checked={formData.passportType === "ECR"} readOnly /> ECR
            </label>
            <label>
              <input type="radio" checked={formData.passportType === "ECNR"} readOnly /> ECNR
            </label>
          </div>
        </div>

        {/* Work Details */}
        <h4>● Work Details</h4>
        <div className="grid-2">
          <label>
            Job Title:{" "}
            <input type="text" value={getOfficeConfirmation("officeConfirmation.work.jobTitle")} readOnly />
          </label>
          <label>
            Country:{" "}
            <input
              type="text"
              value={getOfficeConfirmation("officeConfirmation.country.countryName")}
              readOnly
            />
          </label>
          <label>
            Duty Time:{" "}
            <input type="text" value={getOfficeConfirmation("officeConfirmation.work.WorkTime")} readOnly />
          </label>
          <label>
            Salary:{" "}
            <input type="text" value={getOfficeConfirmation("officeConfirmation.salary")} readOnly />
          </label>
          <label>
            Medical Report: <input type="text" value={formData.medicalReport || ""} readOnly />
          </label>
          <label>
            Interview Status: <input type="text" value={formData.InterviewStatus || ""} readOnly />
          </label>
          <label>
            Service Charge:{" "}
            <input type="text" value={getOfficeConfirmation("officeConfirmation.ServiceCharge")} readOnly />
          </label>
          <label>
            Medical Charge:{" "}
            <input type="text" value={getOfficeConfirmation("officeConfirmation.MedicalCharge")} readOnly />
          </label>
        </div>

        {/* Apply Visa Button */}
        <div className="apply-visa-container">
          {formData.isVisaApply === false ? (
            <button
              type="button"
              className="apply-visa-button"
              onClick={handleApplyVisa}
            >
              Apply for Visa
            </button>
          ) : (
            <button
              type="button"
              className="apply-visa-button update"
              onClick={handleUpdateVisa}
            >
              Update Visa
            </button>
          )}
        </div>

        {/* Visa Application Details Section - Show only if visa is applied */}
        {formData.isVisaApply === true && (
          <div className="visa-details-section">
            <h4>● Visa Application Details</h4>
            <div className="grid-2">
              <label>
                Visa Applied Date: <input type="text" value={formatDate(formData.visaDate)} readOnly />
              </label>
              <label>
                Visa Status: <input type="text" value="Applied" readOnly className="status-applied" />
              </label>
              
              {/* Office Details - Directly from formData.officeId */}
              {getVisaOffice() ? (
                <>
                  <label>
                    Office Name: <input type="text" value={getVisaOffice().officeName || "N/A"} readOnly />
                  </label>
                  <label>
                    Country: <input type="text" value={getVisaOffice().country || "N/A"} readOnly />
                  </label>
                  <label>
                    City: <input type="text" value={getVisaOffice().city || "N/A"} readOnly />
                  </label>
                  <label>
                    State: <input type="text" value={getVisaOffice().state || "N/A"} readOnly />
                  </label>
                  <label>
                    Address: <input type="text" value={getVisaOffice().address || "N/A"} readOnly />
                  </label>
                  <label>
                    Contact: <input type="text" value={getVisaOffice().contact || "N/A"} readOnly />
                  </label>
                  <label>
                    Email: <input type="text" value={getVisaOffice().email || "N/A"} readOnly />
                  </label>
                  <label>
                    Sector: <input type="text" value={getVisaOffice().sector || "N/A"} readOnly />
                  </label>
                </>
              ) : (
                <div className="no-office-data">
                  <span>No office details available</span>
                </div>
              )}
            </div>
          </div>
        )}
      </form>

      {/* Apply/Update Visa Modal */}
      <Dialog
        header={formData.isVisaApply === false ? "Apply for Visa" : "Update Visa Date"}
        visible={showVisaModal}
        style={{ width: "30rem" }}
        onHide={handleCloseModal}
        modal
      >
        <div className="p-fluid">
          {/* Office Dropdown - Only show for new visa application */}
          {formData.isVisaApply === false && (
            <div className="field">
              <label htmlFor="applyInOffice">Apply in Office *</label>
              <Dropdown
                id="applyInOffice"
                value={applyInOffice}
                options={offices}
                onChange={(e) => setApplyInOffice(e.value)}
                placeholder="Select Office"
                filter
                showClear
                filterBy="label"
                className="w-full"
              />
            </div>
          )}

          {/* Visa Date */}
          <div className="field">
            <label htmlFor="visaDate">Visa Date *</label>
            <Calendar
              id="visaDate"
              value={visaDate}
              onChange={(e) => setVisaDate(e.value)}
              dateFormat="dd/mm/yy"
              showIcon
              className="w-full"
              minDate={new Date()}
            />
          </div>

          {/* Admin Charge - Only show for new visa application */}
          {formData.isVisaApply === false && (
            <div className="field">
              <label htmlFor="adminCharge">Admin Charge *</label>
              <InputText
                id="adminCharge"
                value={adminCharge}
                onChange={(e) => setAdminCharge(e.target.value)}
                placeholder="Enter admin charge"
                className="w-full"
                keyfilter="num"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-3">
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-text"
              onClick={handleCloseModal}
              disabled={saving}
            />
            <Button
              label={saving ? "Saving..." : "Save"}
              icon="pi pi-check"
              onClick={handleSaveVisa}
              disabled={saving || !visaDate || (formData.isVisaApply === false && (!applyInOffice || !adminCharge))}
              loading={saving}
            />
          </div>
        </div>
      </Dialog>

       <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default FullLeadPage;