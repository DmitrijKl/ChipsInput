import { useState } from "react";
import "./App.css";
import { ChipsInput } from "./components";

function App() {
  const [value, setValue] = useState<string>("");

  return (
    <div className="App">
      <div className="container">
        <h4>Пример использования готового компонента</h4>
        <div className="chipsContainer">
          <ChipsInput value={value} onChange={setValue} />
        </div>
        <div className="value">Строковое представление: {value}</div>
      </div>
    </div>
  );
}

export default App;
