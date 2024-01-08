import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Products = () => {
  const [products, setProducts] = useState([]);

  const queryParams = {
    limit: "",
    page: "",
    filter: "",
    sort: "asc",
  };
  const queryString = new URLSearchParams(queryParams).toString();

  const fetchProducts = async () => {
    const response = await fetch(
      `http://localhost:8080/api/products?${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    if (response.status == 200) {
      const data = await response.json();
      console.log(data.docs);
      console.log(`http://localhost:8080/api/products?${queryString}`);
      setProducts(data.docs);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <h1 className="h1">Products</h1>
      <div className="container">
        {products.map((product) => (
          <div className="card" style={{ width: "18rem", margin: "5px" }}>
            <div className="card-body">
              <h5 className="card-title">{product.title}</h5>
              <p className="card-text">{product.description}</p>
              <p className="card-text">{product.category}</p>
              <p className="card-text">${product.price}</p>
              <p className="card-text">{product.stock} Unidades</p>
              <p className="card-text">{product._id}</p>
              <Link className="btn btn-secondary" to={"/checkout"}>
                Ver Producto
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
