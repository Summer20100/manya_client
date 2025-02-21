import { FC, useEffect } from "react";
import { useClients } from "../../../store/clients";
import Client from "./Client";

const Clients: FC = () => {
    const { clients, getClients } = useClients();

    useEffect(() => {
        getClients();
    }, [getClients]);

    return (
        <>
            { clients.length > 0
                ?
                <div className="table">
                    <table className="table-products">
                        <thead>
                            <tr>
                                <th className="number">№</th>
                                <th style={{ minWidth: "12rem" }}>Имя</th>
                                <th>Номер телефона</th>
                                <th className="actions">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client, index) => (
                                <Client {...client} key={client.id} index={index} />
                            ))}
                        </tbody>
                    </table>
                </div>
                :
                <h3>Нет пока ничего</h3>
            }
        </>
        
    );
};

export default Clients;
