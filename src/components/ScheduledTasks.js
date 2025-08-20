import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../styles/scheduledTasks.css";

const ScheduledTasks = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchData, setSearchData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [formData, setFormData] = useState({
    scheduledType: "Kampanyalar",
    campaignType: "Unica",
    campaignOffers: [],
    status: "Aktif",
    date: new Date().toISOString().slice(0, 16),
  });

  const tasksPerPage = 8;

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, options } = e.target;
    if (name === "campaignOffers") {
      const selectedValues = Array.from(options)
          .filter((option) => option.selected)
          .map((option) => option.value);
      setFormData((prev) => ({ ...prev, campaignOffers: selectedValues }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Yeni işlem kaydetme
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/tasks/create", formData);
      setTasks([...tasks, response.data]);
      setFormData({
        scheduledType: "Kampanyalar",
        campaignType: "Unica",
        campaignOffers: [],
        status: "Aktif",
        date: new Date().toISOString().slice(0, 16),
      });
    } catch (error) {
      console.error("Kaydetme Hatası:", error);
    }
  };



  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    return tasks.slice(startIndex, endIndex);
  }, [tasks, currentPage, tasksPerPage]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);



  useEffect(() => {
    setTotalPages(Math.ceil(tasks.length / tasksPerPage));
  }, [tasks, tasksPerPage]);

  return (
      <div className="scheduled-tasks-container">
        <div className="scheduled-tasks-header">
          <h2>Zamanlanmış İşlemler</h2>
        </div>

        <form className="scheduled-form" onSubmit={handleSave}>
          <div className="form-group">
            <label>Zamanlı İşlem Tipi</label>
            <select name="scheduledType" value={formData.scheduledType} onChange={handleInputChange}>
              <option value="Kampanyalar">Kampanyalar</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Kampanya Tipi</label>
            <select name="campaignType" value={formData.campaignType} onChange={handleInputChange}>
              <option value="Unica">Unica</option>
              <option value="Unica Arşiv">Unica Arşiv</option>
            </select>
          </div>

          <div className="form-group">
            <label>Kampanya Teklif Adı</label>
            <select name="campaignOffers" multiple value={formData.campaignOffers} onChange={handleInputChange}>
              <option value="Oim Buton Kontrolü">Oim Buton Kontrolü</option>
              <option value="OIM_REGRESYON_COKLU_TEST_SUPPRESSION">OIM_REGRESYON_COKLU_TEST_SUPPRESSION</option>
            </select>
          </div>

          <div className="form-group">
            <label>Durum</label>
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option value="Aktif">Aktif</option>
              <option value="Pasif">Pasif</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tarih</label>
            <input type="datetime-local" name="date" value={formData.date} onChange={handleInputChange} />
          </div>

          <button type="submit" className="save-button">Kaydet</button>
        </form>

        <div className="scheduled-tasks-table">
          <div className="table-responsive">
            {loading ? <div className="loading">Yükleniyor...</div> : (
                <table>
                  <thead>
                  <tr>
                    <th>İşlem</th>
                    <th>Servis Tipi</th>
                    <th>Kodu</th>
                    <th>Kampanya Teklifi</th>
                    <th>İşlem Tipi</th>
                    <th>İşlem Zamanı</th>
                    <th>İşlem Durumu</th>
                  </tr>
                  </thead>
                  <tbody>
                  {paginatedTasks.map((task) => (
                      <tr key={task.id}>
                        <td>
                          <button className="edit-button">Düzenle</button>
                          <button className="delete-button">Sil</button>
                        </td>
                        <td>{task.serviceType}</td>
                        <td>{task.id}</td>
                        <td>{task.offer}</td>
                        <td>{task.processType}</td>
                        <td>{task.processTime}</td>
                        <td>{task.status}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            )}
          </div>
        </div>
      </div>
        );
        };

        export default ScheduledTasks;




