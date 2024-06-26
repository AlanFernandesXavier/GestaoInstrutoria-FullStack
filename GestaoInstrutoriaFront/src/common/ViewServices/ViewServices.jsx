import React, { useState, useEffect } from 'react';
import { useDataContext } from '../../modules/instrutor/services/DataContext';
import { useParams } from 'react-router-dom';
import Header from "../../components/header/Header"
import Layout from "../../modules/instrutor/components/layout/Layout"
import BigInput from "../../components/inputs/BigInput"
import TableSituation from "../../modules/instrutor/components/table/TableSituation"
import Loading from '../loading/Loading';
import "./viewServices.css"

const ViewServices = () => {
    const { id } = useParams();
    const { fetchServiceDetails } = useDataContext();
    const [service, setService] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchServiceDetails(id);
            setService(response);
        };
    
        fetchData();
    }, [id, fetchServiceDetails]);
    
    if (!service) {
        return <Loading />
    }

    let dataFormatada = '';
    let horaInicioFormatada = '';
    let horaFinalFormatada = '';
    let horaTotal = '';
    let minutoTotal = '';
    
    if (service !== null) {
        const [ano, mes, dia] = service.dataServico.split("-");
        dataFormatada = `${dia}/${mes}/${ano}`;
        const [horaInicial, minutoInicial] = service.horaInicio.split(":");
        horaInicioFormatada = `${horaInicial}:${minutoInicial}`;
        const [horaFim, minutoFim] = service.horaFinal.split(":");
        horaFinalFormatada = `${horaFim}:${minutoFim}`;
        horaTotal = service.total.split(":")[0];
        minutoTotal = service.total.split(":")[1];
    }
    

    return (
        <Layout>
            <Header title="Serviço Educacional Cadastrado" description="Veja as informações do serviço educacional que você cadastrou!"/>
            <main className="viewServices-container">
                <div className="title-container">
                    <h1>{service.titulo}</h1>
                </div>

                <div className="situation-container">
                    <TableSituation title={service.status}/>
                </div>

                <div className="serviceInfo-container">
                    <div className="hour-info">
                        <strong>Data: </strong><span>{dataFormatada}</span>
                        <strong>Tipo de Serviço: </strong><span>{service.Servico.nome}</span>
                    </div>
                    <div className="time-info">
                        <strong>Horário Inincial: </strong><span>{horaInicioFormatada}</span>
                        <strong>Horário Final: </strong><span>{horaFinalFormatada}</span>
                        <strong>Total de Horas: </strong>
                        <span>
                            {horaTotal} {horaTotal > 1 || horaTotal === 0 ? "Horas e ": "Hora e "}
                            {minutoTotal} {minutoTotal > 1 || minutoTotal === "00" ? "Minutos": "Minuto"}
                        </span>
                    </div>
                    <div className="description-info">
                        <h2>Descrição do Serviço Educacional:</h2>
                        <BigInput
                        id="description"
                        name="description"
                        value={service.descricao || ''}
                        disabled={true}
                        />
                    </div>
                    <div className="justify-container">
                        <h2>Justificativa do Coordenador:</h2>
                        <div className="justify-info">
                            <BigInput
                            id="justify"
                            name="justify"
                            value={service.justificativa || ''}
                            disabled={true}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    )
}

export default ViewServices;
