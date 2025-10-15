import React, { useEffect, useState } from "react";
import "../CSS/Office.css";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export default function Office() {
  const [offices, setOffices] = useState([]);
  const [filteredOffices, setFilteredOffices] = useState([]);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🌍 Countries state
  const [countries, setCountries] = useState([]);

  const [formData, setFormData] = useState({
    officeName: "",
    ownerOfOffice: "",
    state: "",
    remark: "",
    sector: "",
    city: "",
    country: "",
    contact: "",
    email: "",
    status: "Active",
  });

  // ✅ Fetch all offices
  const fetchOffices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/office/all`);
      setOffices(res.data);
      setFilteredOffices(res.data);
    } catch (error) {
      toast.error("Error fetching offices");
    }
    setLoading(false);
  };

  // ✅ Fetch all countries
  const fetchCountries = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/countries`);
      if (res.data.success) {
        setCountries(res.data.data.map((c) => ({ label: c.countryName, value: c.countryName })));
      }
    } catch (error) {
      toast.error("Error fetching countries");
    }
  };

  useEffect(() => {
    fetchOffices();
    fetchCountries();
  }, []);

  // ✅ Handle Search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredOffices(offices);
    } else {
      const filtered = offices.filter((o) =>
        o.officeName.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredOffices(filtered);
    }
  }, [search, offices]);

  // ✅ Handle Add Office
  const handleAddOffice = async () => {
    try {
      if (!formData.officeName || !formData.ownerOfOffice) {
        toast.warning("Please fill required fields.");
        return;
      }

      await axios.post(`${API_URL}/api/office/add`, formData);
      toast.success("Office added successfully!");
      setVisible(false);
      setFormData({
        officeName: "",
        ownerOfOffice: "",
        state: "",
        remark: "",
        sector: "",
        city: "",
        country: "",
        contact: "",
        email: "",
        status: "Active",
      });
      fetchOffices();
    } catch (error) {
      toast.error("Error adding office");
    }
  };

  return (
    <div className="office-container">
      {/* Header Section */}
      <div className="office-header">
        <div className="office-title">🏢 Office Management</div>
        <div className="office-search-add">
          <span className="p-input-icon-left">
            <InputText
              placeholder="Search Office..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
          <Button
            label="Add Office"
            icon="pi pi-plus"
            onClick={() => setVisible(true)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="table-container">
        <DataTable
          value={filteredOffices}
          paginator
          rows={5}
          loading={loading}
          emptyMessage="No offices found"
          responsiveLayout="scroll"
        >
          <Column field="officeName" header="Office Name" sortable />
          <Column field="ownerOfOffice" header="Owner" sortable />
          <Column field="city" header="City" />
          <Column field="state" header="State" />
          <Column field="country" header="Country" />
          <Column field="email" header="Email" />
          <Column field="contact" header="Contact" />
          <Column field="status" header="Status" />
        </DataTable>
      </div>

      {/* Modal for Add Office */}
      <Dialog
        header="Add New Office"
        visible={visible}
        style={{ width: "40vw" }}
        modal
        onHide={() => setVisible(false)}
      >
        <div className="p-fluid formgrid grid">
          {/* Left Side Fields */}
          <div className="field col-12 md:col-6">
            <label>Office Name</label>
            <InputText
              value={formData.officeName}
              onChange={(e) =>
                setFormData({ ...formData, officeName: e.target.value })
              }
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>Owner of Office</label>
            <InputText
              value={formData.ownerOfOffice}
              onChange={(e) =>
                setFormData({ ...formData, ownerOfOffice: e.target.value })
              }
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>State</label>
            <InputText
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>City</label>
            <InputText
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </div>

          {/* 🌍 Searchable Country Dropdown */}
          <div className="field col-12 md:col-6">
            <label>Country</label>
            <Dropdown
              value={formData.country}
              options={countries}
              onChange={(e) =>
                setFormData({ ...formData, country: e.value })
              }
              placeholder="Select Country"
              filter
              showClear
              filterBy="label"
              className="w-full"
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>Sector</label>
            <InputText
              value={formData.sector}
              onChange={(e) =>
                setFormData({ ...formData, sector: e.target.value })
              }
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>Contact</label>
            <InputText
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>Email</label>
            <InputText
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>Remark</label>
            <InputText
              value={formData.remark}
              onChange={(e) =>
                setFormData({ ...formData, remark: e.target.value })
              }
            />
          </div>

          <div className="field col-12 md:col-6">
            <label>Status</label>
            <select
              className="p-inputtext p-component"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-content-end mt-3">
          <Button
            label="Cancel"
            className="p-button-text p-button-secondary mr-2"
            onClick={() => setVisible(false)}
          />
          <Button label="Save" icon="pi pi-check" onClick={handleAddOffice} />
        </div>
      </Dialog>
    </div>
  );
}
