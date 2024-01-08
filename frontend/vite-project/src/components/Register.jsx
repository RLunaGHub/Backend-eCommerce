import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formRef.current);
    const datForm = new FormData(formRef.current); //Transforma un HTML en un objeto iterador
    const data = Object.fromEntries(datForm); //Dado un objeto iterator me lo transforma en un objeto simple
    console.log(data);

    const response = await fetch(
      "http://localhost:4000/api/sessions/register",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.status == 200) {
      const datos = await response.json();
      navigate("/login");
      console.log(datos);
    } else {
      console.log("Register invalido");
    }
  };

  return (
    <div className="container">
      <h2>Formulario de Registro</h2>
      <form onSubmit={handleSubmit} ref={formRef}>
        <div className="mb-3">
          <label htmlFor="first_name"></label>
          <input type="mail" name="first_name" placeholder="Nombre" />
        </div>
        <div className="mb-3">
          <label htmlFor="last_name"></label>
          <input type="mail" name="last_name" placeholder="Apellido" />
        </div>
        <div className="mb-3">
          <label htmlFor="email"></label>
          <input type="email" name="email" placeholder="Email" />
        </div>
        <div className="mb-3">
          <label htmlFor="password"></label>
          <input type="password" name="password" placeholder="Password" />
        </div>
        <div className="mb-3">
          <label htmlFor="age"></label>
          <input type="number" name="age" placeholder="Edad" />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
