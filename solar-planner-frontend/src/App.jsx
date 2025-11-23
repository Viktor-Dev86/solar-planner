import { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "/api/v1";

function App() {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        autonomyHours: 4,
        systemVoltage: 24,
        items: [
            { name: "Холодильник", powerWatts: 150, quantity: 1, hoursPerDay: 24 },
        ],
    });

    // Загружаем профили при загрузке страницы
    useEffect(() => {
        fetchProfiles();
    }, []);

    // Загрузка всех профилей
    async function fetchProfiles() {
        try {
            setLoading(true);
            setError("");
            const res = await fetch(`${API_BASE}/profiles`);
            if (!res.ok) {
                throw new Error("Не удалось загрузить профили");
            }
            const data = await res.json();
            setProfiles(data);
        } catch (e) {
            console.error(e);
            setError(e.message || "Ошибка загрузки профилей");
        } finally {
            setLoading(false);
        }
    }

    // Обновление простых полей формы
    function updateFormField(field, value) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    // Обновление одного устройства
    function updateItem(index, field, value) {
        setForm((prev) => {
            const items = [...prev.items];
            items[index] = {
                ...items[index],
                [field]: value,
            };
            return { ...prev, items };
        });
    }

    // Добавить новое устройство
    function addItem() {
        setForm((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                { name: "", powerWatts: 0, quantity: 1, hoursPerDay: 1 },
            ],
        }));
    }

    // Удалить устройство
    function removeItem(index) {
        setForm((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    }

    // Создать новый профиль
    async function handleSubmit(e) {
        e.preventDefault();
        setCreating(true);
        setError("");

        const payload = {
            name: form.name,
            autonomyHours: Number(form.autonomyHours),
            systemVoltage: Number(form.systemVoltage),
            items: form.items.map((item) => ({
                name: item.name,
                powerWatts: Number(item.powerWatts),
                quantity: Number(item.quantity),
                hoursPerDay: Number(item.hoursPerDay),
            })),
        };

        try {
            const res = await fetch(`${API_BASE}/profiles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(
                    `Ошибка при создании профиля: ${res.status} ${text || ""}`
                );
            }

            await fetchProfiles();

            // Сбрасываем название, устройства оставляем
            setForm((prev) => ({
                ...prev,
                name: "",
            }));
        } catch (e) {
            console.error(e);
            setError(e.message || "Ошибка при создании профиля");
        } finally {
            setCreating(false);
        }
    }

    // Удаление профиля
    async function handleDelete(id) {
        if (!window.confirm("Точно удалить профиль?")) return;

        try {
            const res = await fetch(`${API_BASE}/profiles/${id}`, {
                method: "DELETE",
            });
            if (!res.ok && res.status !== 204) {
                throw new Error("Не удалось удалить профиль");
            }
            await fetchProfiles();
        } catch (e) {
            console.error(e);
            setError(e.message || "Ошибка удаления");
        }
    }

    return (
        <div className="app">
            <h1>Solar Planner – расчёт солнечной системы</h1>

            {error && <div className="error">{error}</div>}

            {/* Форма создания профиля */}
            <section className="card">
                <h2>Создать профиль нагрузки</h2>
                <form onSubmit={handleSubmit} className="form">
                    <div className="field">
                        <label>Название профиля</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => updateFormField("name", e.target.value)}
                            placeholder="Дом на даче"
                            required
                        />
                    </div>

                    <div className="field-row">
                        <div className="field">
                            <label>Часы автономии</label>
                            <input
                                type="number"
                                min="1"
                                step="0.5"
                                value={form.autonomyHours}
                                onChange={(e) =>
                                    updateFormField("autonomyHours", e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="field">
                            <label>Напряжение системы (В)</label>
                            <input
                                type="number"
                                min="12"
                                step="12"
                                value={form.systemVoltage}
                                onChange={(e) =>
                                    updateFormField("systemVoltage", e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    {/* Устройства */}
                    <h3>Устройства</h3>
                    <div className="items">
                        {form.items.map((item, index) => (
                            <div key={index} className="item-row">
                                <input
                                    type="text"
                                    placeholder="Название"
                                    value={item.name}
                                    onChange={(e) => updateItem(index, "name", e.target.value)}
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Вт"
                                    min="1"
                                    value={item.powerWatts}
                                    onChange={(e) =>
                                        updateItem(index, "powerWatts", e.target.value)
                                    }
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Кол-во"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        updateItem(index, "quantity", e.target.value)
                                    }
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Часов в сутки"
                                    min="0"
                                    step="0.5"
                                    value={item.hoursPerDay}
                                    onChange={(e) =>
                                        updateItem(index, "hoursPerDay", e.target.value)
                                    }
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => removeItem(index)}
                                    disabled={form.items.length === 1}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={addItem}
                    >
                        + Добавить устройство
                    </button>

                    <div className="actions">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={creating}
                        >
                            {creating ? "Создаём..." : "Создать профиль"}
                        </button>
                    </div>
                </form>
            </section>

            {/* Список профилей */}
            <section className="card">
                <h2>Профили нагрузки</h2>
                {loading ? (
                    <p>Загружаем...</p>
                ) : profiles.length === 0 ? (
                    <p>Пока нет ни одного профиля.</p>
                ) : (
                    <div className="profiles-list">
                        {profiles.map((p) => (
                            <div key={p.id} className="profile-card">
                                <div className="profile-header">
                                    <h3>{p.name}</h3>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(p.id)}
                                    >
                                        Удалить
                                    </button>
                                </div>

                                <p>
                                    Автономия: <b>{p.autonomyHours} ч</b>,
                                    {" "}Напряжение: <b>{p.systemVoltage} В</b>
                                </p>

                                <p>
                                    Суммарная мощность нагрузки:{" "}
                                    <b>{p.totalPowerWatts} Вт</b>
                                    <br />
                                    Рекомендуемая мощность инвертора:{" "}
                                    <b>{p.inverterPowerWatts.toFixed(1)} Вт</b>
                                    <br />
                                    Оценочная ёмкость АКБ:{" "}
                                    <b>{p.requiredBatteryAh.toFixed(1)} А·ч</b>
                                </p>

                                <details>
                                    <summary>Устройства</summary>

                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Название</th>
                                            <th>Вт</th>
                                            <th>Кол-во</th>
                                            <th>Часов/сутки</th>
                                            <th>Вт·ч/сутки</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {p.items.map((it) => (
                                            <tr key={it.id}>
                                                <td>{it.name}</td>
                                                <td>{it.powerWatts}</td>
                                                <td>{it.quantity}</td>
                                                <td>{it.hoursPerDay}</td>
                                                <td>{it.dailyEnergyWh}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </details>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default App;
