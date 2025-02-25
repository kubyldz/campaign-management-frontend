import React, { useState } from "react";
import '../styles/scheduledTasks.css'; 

const ScheduledTasks = () => {
  const [formData, setFormData] = useState({
    campaignType: "Unica",
    campaignOffer: [],
    status: "Aktif",
    date: "02/19/2025 02:40 PM",
  });

  return (
    <div className="scheduled-tasks-container min-h-screen p-6 bg-gray-100">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="task-header text-2xl font-bold mb-4 text-gray-800">Zamanlı İşlemler</h1>

        <form className="task-form space-y-4">
          <div className="form-group">
            <label className="block font-medium text-gray-700">Zamanlı İşlem Tipi</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>Kampanyalar</option>
              <option>Diğer</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block font-medium text-gray-700">Kampanya Tipi</label>
            <select
              value={formData.campaignType}
              onChange={(e) => setFormData({ ...formData, campaignType: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Unica</option>
              <option>Unica Arşiv</option>
            </select>
          </div>

          <div className="form-group">
            <label className="block font-medium text-gray-700">Kampanya Teklif Adı</label>
            <div className="flex flex-wrap gap-2">
              {formData.campaignOffer.map((offer, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700"
                >
                  {offer}
                </span>
              ))}
            </div>
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
              type="text"
              value={formData.date}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>

          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200">
            Kaydet
          </button>
        </form>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800">Zamanlanmış Teklifler</h2>
          <table className="w-full mt-2 border border-gray-300 text-gray-700 bg-white">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Servis Tipi</th>
                <th className="p-2 border">Kodu</th>
                <th className="p-2 border">Kampanya Teklifi</th>
                <th className="p-2 border">İşlem Tipi</th>
                <th className="p-2 border">İşlem Zamanı</th>
                <th className="p-2 border">İşlem Durumu</th>
                <th className="p-2 border">Aksiyon</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border"></td>
                <td className="p-2 border"></td>
                <td className="p-2 border"></td>
                <td className="p-2 border"></td>
                <td className="p-2 border"></td>
                <td className="p-2 border"></td>
                <td className="p-2 border flex gap-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200">
                    Düzenle
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200">
                    Sil
                  </button>
                </td>
              </tr>
              <tr>
                <td className="p-2 border"></td>
                <td className="p-2 border"></td>
                <td className="p-2 border"></td>
                <td className="p-2 border"></td>
                <td className="p-2 border"></td>
                <td className="p-2 border"></td>
                <td className="p-2 border flex gap-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200">
                    Düzenle
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200">
                    Sil
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4 text-gray-700">
          <button className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition duration-200">Önceki</button>
          <span className="font-semibold">1</span>
          <button className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition duration-200">Sonraki</button>
        </div>
      </div>
    </div>
  );
};

export default ScheduledTasks;
