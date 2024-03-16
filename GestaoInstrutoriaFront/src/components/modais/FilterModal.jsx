import React, { useState } from 'react';
import { useDataContext } from '../../services/DataContext';
import "./filterModal.css"

const FilterModal = ({ onClose }) => {
    const { serviceTypes } = useDataContext();
    const [situacao, setSituacao] = useState('');

    const handleChange = (event) => {
        setSituacao(event.target.value);
    };

    return(
        <div className="deleteModal-overlay">
        <div className="deleteModal-whrapper">
            <div className="deletModal-container">
                <h2>Filtrar Serviços Educacionais</h2>
                <form action="" className="filter-form">

                    <div className="hour-filter">
                        <div className="timeInput-box">
                            <label htmlFor="">Hora Inicial</label>
                            <input
                                    id="horaInicio"
                                    name="horaInicio"
                                    type="time"
                                />
                        </div>
                        <div className="timeInput-box">
                            <label htmlFor="">Hora Final</label>
                            <input
                                    id="horaInicio"
                                    name="horaInicio"
                                    type="time"
                                />
                        </div>
                    </div>

                    <div className="type-filter">
                        <label htmlFor="">Tipo</label>
                        <select id="filter" name="filter" value={situacao} onChange={handleChange}>
                            <option value="">Escolha o tipo de serviço educacional</option>
                            {serviceTypes ? (
                                serviceTypes.map(service => (
                                    <option value={service.id} key={service.id}>{service.nome}</option>
                            ))
                            ) : (null)}
                            
                        </select>
                    </div>

                    <div className="date-filter">
                        <div className="dateInput-box">
                            <label htmlFor="">Data Inicial</label>
                            <input
                                id="dataServico"
                                name="dataServico"
                                type="date"
                            />
                        </div>
                        <div className="dateInput-box">
                            <label htmlFor="">Data Final</label>
                            <input
                                id="dataServico"
                                name="dataServico"
                                type="date"
                            />
                        </div>
                    </div>

                    <div className="order-filter">
                        <label htmlFor="recent">Mais Recentes</label>
                        <input type="checkbox" name="recent" id="recent" />
                            <p></p>
                        <label htmlFor="oldest">Mais Antigas</label>
                        <input type="checkbox" name="oldest" id="oldest" />
                    </div>

                
                </form>
                <div className="deleteModal-buttons">
                <button className="filterOpen-btn" onClick={onClose}>Cancelar Filtros</button>
                <p></p>
                <button className="filters-btn">Aplicar Filtros</button>
                </div>
                </div>
            </div>
        </div>
    )
}

export default FilterModal;