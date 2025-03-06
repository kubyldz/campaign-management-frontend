import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/campaign.css';
import axios from 'axios';

const Campaign = () => {
  const navigate = useNavigate();
  
  // State management
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchData, setSearchData] = useState({
    campaign: '',
    offer: '',
    treatment: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeStatus, setActiveStatus] = useState('ALL');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const campaignsPerPage = 8;

  // Constants
  const statusTypes = useMemo(() => ({
    ALL: {
      label: 'Tümü',
      value: 'ALL'
    },
    ACTIVE: {
      label: 'Aktif Kampanyalar',
      value: 'ACTIVE'
    },
    PASSIVE: {
      label: 'Pasif Kampanyalar',
      value: 'PASSIVE'
    }
  }), []);

  // Handlers
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

  const handleStatusChange = useCallback((e) => {
    setActiveStatus(e.target.value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleEdit = useCallback((campaignId) => {
    navigate(`/offer/${campaignId}`);
  }, [navigate]);

  const handleSearchChange = useCallback((e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchData({ campaign: '', offer: '', treatment: '' });
  }, []);

  // Data fetching
  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await api.get('/campaigns/getAllCampaigns');
      if (response.data) {
        setCampaigns(response.data);
      }
    } catch (error) {
      console.error('Campaign Error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Kampanyalar yüklenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    let filtered = [...campaigns];

    // Search filter
    if (searchData.campaign || searchData.offer || searchData.treatment) {
      filtered = filtered.filter(campaign => {
        const matchCampaign = campaign.campaign.toLowerCase().includes(searchData.campaign.toLowerCase());
        const matchOffer = campaign.offer.toLowerCase().includes(searchData.offer.toLowerCase());
        const matchTreatment = campaign.treatment.toLowerCase().includes(searchData.treatment.toLowerCase());
        return matchCampaign && matchOffer && matchTreatment;
      });
    }

    // Status filter
    if (activeStatus !== 'ALL') {
      filtered = filtered.filter(campaign => {
        // UNICA servis tipli kampanyalar her zaman aktif olarak değerlendirilir
        const isActive = campaign.serviceType === 'UNICA' ? true : campaign.isActive;
        return activeStatus === 'ACTIVE' ? isActive : !isActive;
      });
    }

    return filtered;
  }, [campaigns, searchData, activeStatus]);

  // Pagination
  const paginatedCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * campaignsPerPage;
    const endIndex = startIndex + campaignsPerPage;
    return filteredCampaigns.slice(startIndex, endIndex);
  }, [filteredCampaigns, currentPage, campaignsPerPage]);

  // Effects
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchCampaigns();
  }, [navigate, fetchCampaigns]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredCampaigns.length / campaignsPerPage));
  }, [filteredCampaigns, campaignsPerPage]);

  // Export function
  const exportCampaignsToExcel = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/campaigns/export', {
        responseType: 'blob',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'campaigns.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export Error:', error);
    }
  };

  // Render helpers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= (isMobile ? 2 : 3); i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 1) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - (isMobile ? 1 : 2); i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        if (!isMobile) pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        if (!isMobile) pageNumbers.push(currentPage + 1);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <div className="campaign-container">
      <div className="campaign-header">
        <div className="header-title">
          <h2>Kampanyalar</h2>
          <span className="campaign-type-label">
            {statusTypes[activeStatus]?.label}
          </span>
        </div>
        <div className="campaign-actions">
          <select 
            className="campaign-select" 
            value={activeStatus}
            onChange={handleStatusChange}
          >
            {Object.entries(statusTypes).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <button className="campaign-button" onClick={exportCampaignsToExcel}>
            <i className="fas fa-file-excel"></i> Excel
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="search-section">
        <div className="search-inputs">
          {[
            { name: 'campaign', label: 'Kampanya' },
            { name: 'offer', label: 'Teklif' },
            { name: 'treatment', label: 'Treatment' }
          ].map(field => (
            <input
              key={field.name}
              type="text"
              name={field.name}
              placeholder={`${field.label} Ara...`}
              value={searchData[field.name]}
              onChange={handleSearchChange}
            />
          ))}
          <button className="search-button" onClick={clearSearch}>
            <i className="fas fa-times"></i> Temizle
          </button>
        </div>
      </div>

      <div className="campaign-table">
        {loading ? (
          <div className="loading">Yükleniyor...</div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th className="edit-column">İşlem</th>
                  <th>Servis Tipi</th>
                  <th>Kampanya ID</th>
                  <th>Kampanya</th>
                  <th>Teklif</th>
                  <th>Treatment</th>
                  <th>Kampanya Tipi</th>
                  <th>Kampanya Alt Tipi</th>
                  <th>Başlangıç Tarihi</th>
                  <th>Bitiş Tarihi</th>
                  <th>Öncelik</th>
                  <th>Statü</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCampaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="edit-column">
                      <button 
                        className="edit-button"
                        onClick={() => handleEdit(campaign.id)}
                        title="Düzenle"
                      >
                        <i className="fas fa-edit"></i>
                        Düzenle
                      </button>
                    </td>
                    <td>{campaign.serviceType}</td>
                    <td>{campaign.id}</td>
                    <td>{campaign.campaign}</td>
                    <td>{campaign.offer}</td>
                    <td>{campaign.treatment}</td>
                    <td>{campaign.campaignType}</td>
                    <td>{campaign.campaignSubtype}</td>
                    <td>{campaign.startDate}</td>
                    <td>{campaign.endDate}</td>
                    <td>{campaign.priority}</td>
                    <td>
                      <span className={`status-${campaign.serviceType === 'UNICA' || campaign.isActive ? 'ACTIVE' : 'PASSIVE'}`}>
                        {campaign.serviceType === 'UNICA' || campaign.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="pagination">
        <button 
          className="pagination-button" 
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          İlk Sayfa
        </button>
        <button 
          className="pagination-button" 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Önceki
        </button>
        <div className="page-numbers">
          {getPageNumbers().map((pageNum, index) => (
            pageNum === '...' ? (
              <span key={`dots-${index}`}>...</span>
            ) : (
              <button
                key={pageNum}
                className={currentPage === pageNum ? 'active' : ''}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            )
          ))}
        </div>
        <button 
          className="pagination-button" 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sonraki
        </button>
        <button 
          className="pagination-button" 
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Son Sayfa
        </button>
      </div>
    </div>
  );
};

export default Campaign; 