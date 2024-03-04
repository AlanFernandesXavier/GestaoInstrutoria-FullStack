import { Link } from "react-router-dom";
import "./tableSituation.css"

const TableSituation = (props) => {
    let className = 'tableSituation';

    switch (props.title) {
        case 'Em Análise':
            className += ' analysis';
            break;
        case 'Validado':
            className += ' validate';
            break;
        case 'Parcialmente Validado':
            className += ' partial';
            break;
        case 'Recusado':
            className += ' refused';
            break;
        default:
            break;
    }

    return (
        <Link to={props.url}>
        <div className={className}>
            <p>{props.title}</p>
        </div>
        </Link>
    )
}

export default TableSituation;