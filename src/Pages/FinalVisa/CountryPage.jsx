import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
// import '../CSS/Country.css'

const CountryPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({ countryName: "" });
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("FinalVisaId")) {
      navigate("/");
    }
  }, [navigate]);

  const FinalVisaId = localStorage.getItem("FinalVisaId");

  // Fetch all countries
  const fetchCountries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/countries`);
      setCountries(res.data.data || []);
    } catch (err) {
      toast.error("Error fetching countries");
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Open modal for add
  const openAddDialog = () => {
    setFormData({ countryName: "" });
    setIsEdit(false);
    setDialogVisible(true);
  };

  // Open modal for edit
  const openEditDialog = (row) => {
    setFormData({ countryName: row.countryName });
    setSelectedId(row._id);
    setIsEdit(true);
    setDialogVisible(true);
  };

  // Submit form (add or edit)
  const handleSubmit = async () => {
    try {
      if (!FinalVisaId) {
        toast.error("Admin ID not found in localStorage");
        return;
      }

      const payload = {
        ...formData,
        countryAddedBy: FinalVisaId,
      };

      if (isEdit) {
        await axios.put(`${API_URL}/api/countries/${selectedId}`, payload);
        toast.success("Country updated successfully");
      } else {
        await axios.post(`${API_URL}/api/countries`, payload);
        toast.success("Country added successfully");
      }
      setDialogVisible(false);
      fetchCountries();
    } catch (err) {
      toast.error("Error saving country");
    }
  };

  // Delete country with confirmation
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This country will be deleted permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/api/countries/${id}`);
          toast.success("Country deleted successfully");
          fetchCountries();
        } catch (err) {
          console.error(err);
          toast.error("Error deleting country");
        }
      }
    });
  };

  // Action buttons template
  const actionTemplate = (row) => (
    <div className="country-action-buttons">
      <Button
        icon="pi pi-pencil"
        className="country-edit-btn p-button-rounded"
        onClick={() => openEditDialog(row)}
      />
      <Button
        icon="pi pi-trash"
        className="country-delete-btn p-button-rounded"
        onClick={() => handleDelete(row._id)}
      />
    </div>
  );

  return (
    <div className="country-page-container">
      <ToastContainer position="top-right" className="country-toast-container" />

      {/* Header Section */}
      <div className="country-header-section">
        <div className="country-header-content">
          <div className="country-title-section">
            <i className="pi pi-globe country-header-icon"></i>
            <div>
              <h1 className="country-page-title">Country Management</h1>
              <p className="country-page-subtitle">Manage and organize countries efficiently</p>
            </div>
          </div>
          <Button
            label="Add New Country"
            icon="pi pi-plus"
            className="country-add-btn"
            onClick={openAddDialog}
          />
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="country-controls-section">
        <div className="country-search-container">
          <span className="country-search-wrapper p-input-icon-left">
            <i className="pi pi-search country-search-icon" />
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search countries..."
              className="country-search-input"
            />
          </span>
        </div>

        <div className="country-stats-container">
          <div className="country-stat-card">
            <span className="country-stat-number">{countries?.length || 0}</span>
            <span className="country-stat-label">Total Countries</span>
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="country-table-container">
        <DataTable
          value={countries || []}
          paginator
          rows={10}
          loading={loading}
          globalFilter={globalFilter}
          emptyMessage="No countries found"
          className="country-datatable"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        >
          <Column
            field="countryName"
            header="Country Name"
            className="country-name-column"
            headerClassName="country-header-cell"
          />
          <Column
            field="countryAddedBy.role"
            header="Added By"
            className="country-added-by-column"
            headerClassName="country-header-cell"
          />
          <Column
            body={(row) => (
              <span className="country-date-cell">
                {new Date(row.createdAt).toLocaleString()}
              </span>
            )}
            header="Created At"
            className="country-date-column"
            headerClassName="country-header-cell"
          />
          <Column
            body={actionTemplate}
            header="Actions"
            className="country-actions-column"
            headerClassName="country-header-cell"
          />
        </DataTable>
      </div>

      {/* Modal Dialog */}
      <Dialog
        header={
          <div className="country-dialog-header">
            <i className={`pi ${isEdit ? "pi-pencil" : "pi-plus"} country-dialog-icon`}></i>
            <span>{isEdit ? "Edit Country" : "Add New Country"}</span>
          </div>
        }
        visible={dialogVisible}
        className="country-dialog"
        onHide={() => setDialogVisible(false)}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        style={{ width: "450px" }}
      >
        <div className="country-form-container p-fluid">
          <div className="country-form-field">
            <label htmlFor="countryName" className="country-form-label">
              Country Name <span className="country-required">*</span>
            </label>
            <InputText
              id="countryName"
              name="countryName"
              value={formData.countryName}
              onChange={handleChange}
              required
              className="country-form-input"
              placeholder="Enter country name"
            />
          </div>

          <div className="country-form-actions">
            <Button
              label="Cancel"
              className="country-cancel-btn p-button-text"
              onClick={() => setDialogVisible(false)}
            />
            <Button
              label={isEdit ? "Update Country" : "Save Country"}
              className="country-save-btn"
              onClick={handleSubmit}
              disabled={!formData.countryName.trim()}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CountryPage;
