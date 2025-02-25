import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/campaign.css';
import axios from 'axios';

const Campaign = () => {
  const navigate = useNavigate();
  const [campaignType, setCampaignType] = useState('ALL');
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
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const campaignsPerPage = 8; // Set the number of campaigns per page

  const campaignTypes = {
    ALL: {
      label: 'Tümü',
      value: 'ALL'  
    },
    SEASONAL: {
      label: 'Sezonluk Kampanya',
      value: 'SEASONAL'  
    },
    STANDARD: {
      label: 'Standart Kampanya',
      value: 'STANDARD'  
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      await fetchCampaigns();
    } catch (error) {
      console.error('Auth Error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const fetchCampaigns = async (type = campaignType) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      let url;
      if (type === 'ALL') {
        url = '/campaigns/getAllCampaigns';
      } else {
        url = `/campaigns/getByCampaignType?campaignType=${encodeURIComponent(type)}`;
      }

      const response = await api.get(url);
      
      if (response.data) {
        setCampaigns(response.data);
        setFilteredCampaigns(response.data);
      }
    } catch (error) {
      console.error('Campaign Error:', error.response ? error.response.data : error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Kampanyalar yüklenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignTypeChange = async (e) => {
    try {
      const selectedType = e.target.value;
      setCampaignType(selectedType);
      await fetchCampaigns(selectedType);
    } catch (error) {
      console.error('Campaign Type Change Error:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchCampaigns(campaignType); // Fetch campaigns for the selected page
  };

  const goToFirstPage = () => handlePageChange(1);
  const goToLastPage = () => handlePageChange(totalPages);

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

  const handleEdit = (campaignId) => {
    navigate(`/offer/${campaignId}`); // Redirect to Offer.js with campaignId
  };

  const handleSearch = () => {
    const { campaign, offer, treatment } = searchData;

    const filtered = campaigns.filter(c => {
      const matchesCampaign = c.campaign.toLowerCase().includes(campaign.toLowerCase());
      const matchesOffer = c.offer.toLowerCase().includes(offer.toLowerCase());
      const matchesTreatment = c.treatment.toLowerCase().includes(treatment.toLowerCase());
      return matchesCampaign && matchesOffer && matchesTreatment;
    });

    setFilteredCampaigns(filtered);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prevState => ({ ...prevState, [name]: value }));
    handleSearch(); 
  };

  const exportCampaignsToExcel = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/campaigns/export', {
        responseType: 'blob', 
        headers: {
          'Authorization': `Bearer ${token}`
        }
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

  // Fetch campaigns based on currentPage
  const indexOfLastCampaign = currentPage * campaignsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
  const currentCampaigns = filteredCampaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);

  // Function to handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="campaign-container">
      <div className="campaign-header">
        <div className="header-title">
          <h2>Kampanyalar</h2>
          <span className="campaign-type-label">
            {campaignTypes[campaignType] ? `(${campaignTypes[campaignType].label})` : '(Geçersiz Kampanya Tipi)'}
          </span>
        </div>
        <div className="campaign-actions">
          <select 
            className="campaign-select" 
            value={campaignType}
            onChange={handleCampaignTypeChange}
          >
            {Object.entries(campaignTypes).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <button className="campaign-button" onClick={exportCampaignsToExcel}>Excel</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="search-section">
        <div className="search-inputs">
          <input
            type="text"
            name="campaign"
            placeholder="Kampanya"
            value={searchData.campaign}
            onChange={handleSearchChange}
          />
          <input
            type="text"
            name="offer"
            placeholder="Teklif"
            value={searchData.offer}
            onChange={handleSearchChange}
          />
          <input
            type="text"
            name="treatment"
            placeholder="Treatment"
            value={searchData.treatment}
            onChange={handleSearchChange}
          />
          <button className="search-button" onClick={() => setSearchData({ campaign: '', offer: '', treatment: '' })}>Temizle</button>
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
                {currentCampaigns.map((campaign, index) => (
                  <tr key={index}>
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
                      <span className={`status-${campaign.status.toLowerCase()}`}>
                        {campaign.status}
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
          onClick={goToFirstPage}
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
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
        >
          Son Sayfa
        </button>
      </div>
    </div>
  );
};

export default Campaign; 