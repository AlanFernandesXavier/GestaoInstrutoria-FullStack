import { useEffect, useState } from "react";
import ValidationButtons from "./ValidationButtons";
import { useCoordenadorContext } from "../../services/CoordenadorContext";
import { faCheck, faXmark, faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const ValidationTable = ({id}) => {
    const { fetchInstructorRegisters, validateInstructorRegister, partiallyValidateInstructorRegister } = useCoordenadorContext();
    const [instructorRegisters, setInstructorRegisters] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchInstructorRegisters(id);
                setInstructorRegisters(data);
            } catch (error) {
                console.error("Erro ao buscar registros do instrutor:", error);
            }
        };
        fetchData();
    }, [fetchInstructorRegisters, id]);

    const handleAccept = (registerId) => {
        validateInstructorRegister(registerId, "123456");
    };
    const handleRefuse = (registerId) => {
        partiallyValidateInstructorRegister(registerId, "123456", "justificativa válida", "00:00:00");
    };
    

    return (
            <table className='table'>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Data</th>
                        <th>Hora Inicial</th>
                        <th>Hora Final</th>
                        <th>Total de Horas</th>
                        <th>Tipo</th>
                        <th colSpan={3}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                {instructorRegisters.map(register => (
                    <tr key={register.id}>
                        <td>{register.titulo}</td>
                        <td>{register.dataServico}</td>
                        <td>{register.horaInicio}</td>
                        <td>{register.horaFinal}</td>
                        <td>{register.total}</td>
                        <td>{register.Servico.nome}</td>
                        <td>
                            <ValidationButtons
                                type="accept"
                                icon={faCheck}
                                legenda="VALIDAR SERVIÇO EDUCACIONAL"
                                onClick={() => handleAccept(register.id)}
                            />
                        </td>
                        <td>
                            <ValidationButtons
                                type="reject"
                                icon={faXmark}
                                legenda="REJEITAR SERVIÇO EDUCACIONAL"
                                onClick={() => handleRefuse(register.id)}
                            />
                        </td>
                        <td>
                            <ValidationButtons
                                type="view"
                                icon={faCircleInfo}
                                legenda="VISUALIZAR SERVIÇO EDUCACIONAL"
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
    )
}

export default ValidationTable;