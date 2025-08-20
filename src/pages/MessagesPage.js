import React, { useEffect, useMemo, useRef, useState } from "react";
import { MENUS } from "../constants/menus";
import "../styles/messages.css";

const PAGE_SIZE = 10;

export default function MessagesPage() {
    const [menu, setMenu] = useState(MENUS[0]);
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const searchRef = useRef(null);

    // basit debounce
    const [internalSearch, setInternalSearch] = useState("");
    useEffect(() => {
        const t = setTimeout(() => setSearch(internalSearch), 300);
        return () => clearTimeout(t);
    }, [internalSearch]);

    async function fetchMessages() {
        setLoading(true);
        setErr(null);
        try {
            const params = new URLSearchParams({
                menu: menu || "",
                search: search || "",
                page: String(page),
                size: String(PAGE_SIZE)
            });
            const res = await fetch(`/api/messages?${params.toString()}`);
            if (!res.ok) throw new Error("Liste alınamadı");
            const json = await res.json(); // Spring Page<?> bekleniyor
            setData(json.content || []);
            setTotalPages(json.totalPages || 0);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setPage(0); // filtre değişince başa dön
    }, [menu, search]);

    useEffect(() => {
        fetchMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menu, search, page]);

    async function updateValue(id, newValue) {
        const res = await fetch(`/api/messages/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: newValue })
        });
        if (!res.ok) throw new Error("Güncelleme başarısız");
    }

    async function deleteRow(id) {
        const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Silme başarısız");
    }

    function Row({ row }) {
        const [val, setVal] = useState(row.value);
        const [saving, setSaving] = useState(false);

        const onSave = async () => {
            if (val === row.value) return;
            setSaving(true);
            try {
                await updateValue(row.id, val);
                await fetchMessages();
            } finally {
                setSaving(false);
            }
        };

        const onDelete = async () => {
            if (!window.confirm("Bu mesaj silinsin mi?")) return;
            await deleteRow(row.id);
            await fetchMessages();
        };

        return (
            <tr>
                <td className="col-key" title={row.key}>{row.key}</td>
                <td className="col-value">
          <textarea
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onBlur={onSave}
              rows={2}
          />
                </td>
                <td className="col-actions">
                    <button className="btn btn-green" onClick={onSave} disabled={saving}>
                        Güncelle
                    </button>
                    <button className="btn btn-red" onClick={onDelete}>
                        Sil
                    </button>
                </td>
            </tr>
        );
    }

    const pager = useMemo(() => {
        const pages = [];
        for (let i = 0; i < totalPages; i++) pages.push(i);
        const windowed = pages.slice(
            Math.max(0, page - 2),
            Math.min(totalPages, page + 3)
        );
        return windowed;
    }, [page, totalPages]);

    return (
        <div className="messages-page">
            <div className="header">
                <h1>Bundle Metinleri</h1>
            </div>

            <div className="toolbar">
                <select value={menu} onChange={(e) => setMenu(e.target.value)}>
                    {MENUS.map((m, i) => (
                        <option key={`${m}-${i}`} value={m}>{m}</option>
                    ))}
                </select>

                <input
                    ref={searchRef}
                    className="search"
                    placeholder="Search…"
                    value={internalSearch}
                    onChange={(e) => setInternalSearch(e.target.value)}
                />
            </div>

            <div className="table-wrap">
                <table className="messages-table">
                    <thead>
                    <tr>
                        <th>Key</th>
                        <th>Value</th>
                        <th className="th-actions">İşlem</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr><td colSpan="3" className="loading">Yükleniyor…</td></tr>
                    ) : err ? (
                        <tr><td colSpan="3" className="error">{err}</td></tr>
                    ) : data.length === 0 ? (
                        <tr><td colSpan="3" className="empty">Kayıt yok</td></tr>
                    ) : (
                        data.map((row) => <Row key={row.id} row={row} />)
                    )}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button disabled={page === 0} onClick={() => setPage(0)}>İlk</button>
                <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Önceki</button>
                {pager.map((p) => (
                    <button
                        key={p}
                        className={p === page ? "active" : ""}
                        onClick={() => setPage(p)}
                    >
                        {p + 1}
                    </button>
                ))}
                <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Sonraki</button>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>Son</button>
            </div>
        </div>
    );
}
