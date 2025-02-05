import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const painéis = [
    { id: 1, titulo: "Painel 1" },
    { id: 2, titulo: "Painel 2" },
    { id: 3, titulo: "Painel 3" },
  ];

  return (
    <div>
      <h1>Lista de Painéis</h1>
      <ul>
        {painéis.map((painel) => (
          <li key={painel.id}>
            <Link to={`/painel/${painel.id}`}>{painel.titulo}</Link>
          </li>
        ))}
      </ul>

      {/* Link para a página Centro Pop Santos */}
      <div className="mt-4">
        <Link to="/cartografiasocial/centro_pop_santos" className="text-blue-500">
          Ver Centro Pop Santos
        </Link>
      </div>
    </div>
  );
};

export default Home;
