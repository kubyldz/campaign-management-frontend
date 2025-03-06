import React, { useState } from 'react';
import '../styles/offer.css';
import { useNavigate } from 'react-router-dom';

const Offer = () => {
  const [formData, setFormData] = useState({
    campaign: '',
    offer: '',
    treatment: '',
    customerType: 'bireysel',
    status: 'Pasif',
    platform: 'Tümü',
    campaignType: 'Standard Kampanyası',
    subCampaignType: 'Standard',
    loginCount: '',
    testMsisdn: '',
    campaignTitle: '',
    offerText: '',
    selectedMenu: 'Fatura İşlemlerim>Faturalarım'
  });

  const [selectedMenus] = useState([
    
  ]);

  const [toggles, setToggles] = useState({
    dashboard: true,
    popup: true,
    offerPage: true,
    approvalPage: false,
    resultPage: true
  });

  const [buttons] = useState([
    { label: 'Onay', action: 'Kabul', checked: true },
    { label: 'İlgilenmiyorum', action: 'Red', checked: true },
    { label: 'Devam', action: 'Devam', checked: false },
    { label: 'Tamam', action: 'Url', checked: false, url: 'https://xxx.xxx' },
    { label: 'Vazgeç', action: 'Kapat', checked: true }
  ]);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  const handleBack = () => {
    navigate('/campaigns');
  };

  return (
    <div className="scheduled-tasks-container">
      <div className="task-header">
        <div className="task-tabs">
          <button className="tab-button">Kampanya</button>
          <button className="tab-button">Teklif</button>
          <button className="tab-button">Treatment</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label>Müşteri Kapsamı Seçimi</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="customerType"
                    value="kurumsal"
                    checked={formData.customerType === 'kurumsal'}
                    onChange={(e) => setFormData({...formData, customerType: e.target.value})}
                  />
                  Kurumsal
                </label>
                <label>
                  <input
                    type="radio"
                    name="customerType"
                    value="bireysel"
                    checked={formData.customerType === 'bireysel'}
                    onChange={(e) => setFormData({...formData, customerType: e.target.value})}
                  />
                  Bireysel
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Tanımlı Menü</label>
              <select
                value={formData.selectedMenu}
                onChange={(e) => setFormData({...formData, selectedMenu: e.target.value})}
              >
                <option value="Fatura İşlemlerim>Faturalarım"></option>
                <option value="Fatura İşlemlerim>Fatura Öde"></option>
                <option value="Fatura İşlemlerim>Otomatik Ödeme Talimatı"></option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Kampanya Statüsü</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Pasif">Pasif</option>
                <option value="Aktif">Aktif</option>
              </select>
            </div>

            <div className="form-group">
              <label>Kampanya Tipi</label>
              <select
                value={formData.campaignType}
                onChange={(e) => setFormData({...formData, campaignType: e.target.value})}
              >
                <option value="Standard Kampanyası">Standard Kampanyası</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Platform</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({...formData, platform: e.target.value})}
              >
                <option value="Tümü">Tümü</option>
                <option value="Android">Android</option>
                <option value="IOS">IOS</option>
              </select>
            </div>

            <div className="form-group">
              <label>Alt Kampanya Tipi</label>
              <select
                value={formData.subCampaignType}
                onChange={(e) => setFormData({...formData, subCampaignType: e.target.value})}
              >
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tekrar Gösterim Login Sayısı</label>
              <input
                type="text"
                value={formData.loginCount}
                onChange={(e) => setFormData({...formData, loginCount: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Kampanya Kısa Başlığı</label>
              <input
                type="text"
                value={formData.campaignTitle}
                onChange={(e) => setFormData({...formData, campaignTitle: e.target.value})}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Test Msisdn</label>
              <input
                type="text"
                value={formData.testMsisdn}
                onChange={(e) => setFormData({...formData, testMsisdn: e.target.value})}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group file-upload">
              <label>Arka Plan Görseli</label>
              <input type="file" />
              <button type="button" className="preview-button">Önizleme</button>
            </div>
          </div>

          <div className="form-row toggles">
            <div className="toggle-group">
              <label>
                <input
                  type="checkbox"
                  checked={toggles.dashboard}
                  onChange={(e) => setToggles({...toggles, dashboard: e.target.checked})}
                />
                Dashboardda Gösterilsin
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={toggles.popup}
                  onChange={(e) => setToggles({...toggles, popup: e.target.checked})}
                />
                Popup Olarak Gösterilsin
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={toggles.offerPage}
                  onChange={(e) => setToggles({...toggles, offerPage: e.target.checked})}
                />
                Teklif Sayfası
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Teklif Metni</label>
              <textarea
                value={formData.offerText}
                onChange={(e) => setFormData({...formData, offerText: e.target.value})}
                maxLength={400}
              />
              <div className="char-count">Max karakter sayısı: 400</div>
            </div>
          </div>

          <div className="button-actions">
            <table>
              <thead>
                <tr>
                  <th>Teklif Sayfası</th>
                  <th>Buton İsmi</th>
                  <th>Aksiyon</th>
                  <th>URL</th>
                </tr>
              </thead>
              <tbody>
                {buttons.map((button, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={button.checked}
                        readOnly
                      />
                    </td>
                    <td>{button.label}</td>
                    <td>{button.action}</td>
                    <td>{button.url || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button">Kaydet</button>
        </div>
      </form>
    </div>
  );
};

export default Offer; 