import React, { useState } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import '../styles/scheduledTasks.css'; 

const ScheduledTasks = () => {
  const [formData, setFormData] = useState({
    campaignType: "Unica",
    campaignOffer: "",
    status: "Aktif",
    date: new Date(),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prevState => ({
      ...prevState,
      date: date
    }));
  };

  const handleRemoveOffer = (offerToRemove) => {
    setFormData(prevState => ({
      ...prevState,
      campaignOffer: prevState.campaignOffer.filter(offer => offer !== offerToRemove)
    }));
  };

  return (
    <div className="scheduled-tasks-container min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="task-header text-2xl font-bold mb-4 text-gray-800">Zamanlı İşlemler</h1>

        <form className="task-form space-y-4">
          <div className="form-group">
            <label className="block font-medium text-gray-700">Zamanlı İşlem Tipi</label>
            <input
              type="text"
              value="Kampanyalar"
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          <div className="form-group">
            <label className="block font-medium text-gray-700">Kampanya Tipi</label>
            <select
              name="campaignType"
              value={formData.campaignType}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Unica">Unica</option>
              <option value="Unica Arşiv">Unica Arşiv</option>
            
            </select>
          </div>

          <div className="form-group">
            <label className="block font-medium text-gray-700">Kampanya Teklif Adı</label>
            <select
              name="campaignOffer"
              value={formData.campaignOffer}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Seçiniz</option>
              <option value="KURUMSAL_DENEME_TEKLİFİ">KURUMSAL_DENEME_TEKLİFİ</option>
              <option value="Fonksiyonel Pre OSM Servisleri Kopya">Fonksiyonel Pre OSM Servisleri Kopya</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block font-medium text-gray-700">Durum</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Aktif</option>
              <option>Pasif</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block font-medium text-gray-700">Tarih</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="flex justify-end mt-6">
            <button 
              type="submit" 
              className="campaign-button bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition duration-200 text-sm font-medium flex items-center gap-2 shadow-sm"
            >
              <i className="fas fa-save mr-1"></i>
              Kaydet
            </button>
          </div>
        </form>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800">Zamanlanmış Teklifler</h2>
          <div className="table-responsive">
            <table className="w-full mt-2">
              <thead>
                <tr>
                  <th className="edit-column p-2 border text-left">İşlem</th>
                  <th className="p-2 border text-left">Servis Tipi</th>
                  <th className="p-2 border text-left">Kodu</th>
                  <th className="p-2 border text-left">Kampanya Teklifi</th>
                  <th className="p-2 border text-left">İşlem Tipi</th>
                  <th className="p-2 border text-left">İşlem Zamanı</th>
                  <th className="p-2 border text-left">İşlem Durumu</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="edit-column p-2 border">
                    <div className="flex gap-2 justify-center">
                      <button 
                        className="scheduled-edit-button text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        title="Düzenle"
                      >
                        <i className="fas fa-edit"></i>
                        Düzenle
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800 font-medium"
                        title="Sil"
                      >
                        <i className="fas fa-trash"></i>
                        Sil
                      </button>
                    </div>
                  </td>
                  <td className="p-2 border">Unica</td>
                  <td className="p-2 border">7162</td>
                  <td className="p-2 border">KURUMSAL_DENEME_TEKLİFİ</td>
                  <td className="p-2 border">ACTIVE</td>
                  <td className="p-2 border">11.02.2025 13:39</td>
                  <td className="p-2 border">
                    <span className="status-ACTIVE">BEKLEMEDE</span>
                  </td>
                </tr>
                <tr>
                  <td className="edit-column p-2 border">
                    <div className="flex gap-2 justify-center">
                      <button 
                        className="scheduled-edit-button text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        title="Düzenle"
                      >
                        <i className="fas fa-edit"></i>
                        Düzenle
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800 font-medium"
                        title="Sil"
                      >
                        <i className="fas fa-trash"></i>
                        Sil
                      </button>
                    </div>
                  </td>
                  <td className="p-2 border">Unica</td>
                  <td className="p-2 border">6917</td>
                  <td className="p-2 border">Fonksiyonel Pre OSM Servisleri Kopya</td>
                  <td className="p-2 border">ACTIVE</td>
                  <td className="p-2 border">11.02.2025 13:39</td>
                  <td className="p-2 border">
                    <span className="status-ACTIVE">BEKLEMEDE</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="pagination mt-4">
          <button 
            className="pagination-button text-gray-600 hover:text-gray-800 font-medium px-4 py-2"
            disabled={true}
          >
            İlk Sayfa
          </button>
          <button 
            className="pagination-button text-gray-600 hover:text-gray-800 font-medium px-4 py-2"
            disabled={true}
          >
            Önceki
          </button>
          <div className="page-numbers">
            <button className="active px-3 py-1">1</button>
          </div>
          <button 
            className="pagination-button text-gray-600 hover:text-gray-800 font-medium px-4 py-2"
            disabled={true}
          >
            Sonraki
          </button>
          <button 
            className="pagination-button text-gray-600 hover:text-gray-800 font-medium px-4 py-2"
            disabled={true}
          >
            Son Sayfa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduledTasks;
