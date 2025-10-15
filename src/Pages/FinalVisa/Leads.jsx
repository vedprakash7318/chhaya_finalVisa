import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { ToastContainer, toast } from "react-toastify";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Card } from "primereact/card";
import { Tooltip } from "primereact/tooltip";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "react-toastify/dist/ReactToastify.css";
import "../CSS/Lead.css";
import { useNavigate } from "react-router-dom";

const FinalVisaLeads = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 1,
    search: "",
  });
  const navigate = useNavigate();
  const finalVisaManagerId = localStorage.getItem("FinalVisaId");

  const fetchData = async () => {
    if (!finalVisaManagerId) {
      toast.error("Final Visa Manager ID not found. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/client-form/final-visa`, {
        params: {
          page: lazyParams.page,
          limit: lazyParams.rows,
          search: lazyParams.search,
          finalVisaManagerId,
        },
        timeout: 10000,
      });
      
      console.log("API Response:", res.data);
      
      setClients(res.data.data || []);
      setTotalRecords(res.data.total || 0);
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      
      if (err.response?.status === 400) {
        toast.error(err.response.data.message || "Invalid request parameters");
      } else if (err.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (err.code === 'ECONNABORTED') {
        toast.error("Request timeout. Please check your connection.");
      } else {
        toast.error(err.response?.data?.message || "Failed to load data");
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [lazyParams]);

  const onPage = (event) => {
    setLazyParams((prev) => ({
      ...prev,
      first: event.first,
      rows: event.rows,
      page: event.page + 1,
    }));
  };

  const onSearch = (e) => {
    const value = e.target.value;
    setLazyParams((prev) => ({
      ...prev,
      search: value,
      page: 1,
      first: 0,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const viewClient = (clientData) => {
    console.log(clientData._id);
    navigate('full-lead-page', { state: clientData._id });
  };

  const actionButtons = (rowData) => {
    return (
      <div className="final-visa-action-buttons">
        <Tooltip target=".final-visa-view-btn" position="top" content="View Client Details" />
        <Button 
          icon="pi pi-eye" 
          className="final-visa-view-btn p-button-rounded p-button-text p-button-primary p-mr-2" 
          onClick={() => viewClient(rowData)}
        />
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    // Check if isVisaApply is true, then show "Applied"
    if (rowData.isVisaApply === true) {
      return <Badge value="Applied" severity="info" />;
    }
    
    // Otherwise show the regular status
    const status = rowData.status || 'Pending';
    let severity = 'warning';
    
    if (status === 'Approved') severity = 'success';
    if (status === 'Rejected') severity = 'danger';
    if (status === 'In Review') severity = 'info';
    
    return <Badge value={status} severity={severity} />;
  };

  const getStatusValueForSorting = (rowData) => {
    // For sorting purposes, return the actual status value
    if (rowData.isVisaApply === true) {
      return "Applied";
    }
    return rowData.status || 'Pending';
  };

  return (
    <div className="final-visa-container p-4">
      <Card className="final-visa-header-card">
        <div className="final-visa-header">
          <div className="final-visa-title-section">
            <i className="pi pi-users final-visa-main-icon"></i>
            <h2 className="final-visa-title">Final Visa Clients</h2>
          </div>
          
          <div className="final-visa-search-section">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                value={lazyParams.search}
                onChange={onSearch}
                placeholder="Search clients..."
                className="final-visa-search-input"
              />
            </span>
          </div>
        </div>
      </Card>

      <Card className="final-visa-content-card">
        {loading ? (
          <div className="final-visa-loading">
            <ProgressSpinner />
            <p className="final-visa-loading-text">Loading client data...</p>
          </div>
        ) : (
          <DataTable
            value={clients}
            lazy
            paginator
            rows={lazyParams.rows}
            first={lazyParams.first}
            totalRecords={totalRecords}
            onPage={onPage}
            loading={loading}
            stripedRows
            showGridlines
            className="final-visa-datatable p-datatable-sm"
            emptyMessage="No clients found."
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            responsiveLayout="stack"
          >
            <Column field="fullName" header="Name" sortable />
            <Column field="contactNo" header="Phone" sortable />
            <Column field="email" header="Email" sortable />
            <Column field="passportNumber" header="Passport No" sortable />
            <Column 
              header="Status" 
              body={statusBodyTemplate}
              sortable 
              sortField="status"
              sortFunction={(a, b) => {
                const statusA = getStatusValueForSorting(a);
                const statusB = getStatusValueForSorting(b);
                return statusA.localeCompare(statusB);
              }}
            />
            <Column 
              header="Actions" 
              body={actionButtons}
              exportable={false}
              style={{ minWidth: '8rem' }}
            />
          </DataTable>
        )}
      </Card>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="final-visa-toast"
      />
    </div>
  );
};

export default FinalVisaLeads;