import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import store from "./Store";

const GithubFinder = observer(() => {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    store.setUsername(input);
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Введите имя пользователя"
      />
      <button onClick={handleSearch}>Поиск</button>

      {store.loading && <p>Загрузка...</p>}
      {store.error && <p style={{ color: "red" }}>{store.error}</p>}

      <div>
        {store.repos.map((repo) => (
          <div key={repo.id} style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
            <h3>{repo.name}</h3>
            <p>{repo.description || "Описание отсутствует"}</p>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">Перейти</a>
          </div>
        ))}
      </div>
    </div>
  );
});

export default GithubFinder;
