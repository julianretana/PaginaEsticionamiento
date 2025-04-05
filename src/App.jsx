import { useEffect, useState } from 'react';

import Footer from './components/Footer';
import Header from './components/Header';
import Producto from './components/Producto';
import { db } from './data/db';

function App() {
  const [data, setData] = useState(db);
  const [carrito, setCarrito] = useState(() => {
    const savedCarrito = localStorage.getItem("carrito");
    return savedCarrito ? JSON.parse(savedCarrito) : [];
  });

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // Agregar al carrito con restricción de máximo 5 unidades
  function addToCart(item) {
    const itemExist = carrito.findIndex(producto => producto.id === item.id);

    if (itemExist >= 0) {
      // Si el producto ya está en el carrito y tiene menos de 5 unidades, permitir agregar
      if (carrito[itemExist].quantity < 5) {
        const updateCarrito = [...carrito];
        updateCarrito[itemExist].quantity++;
        setCarrito(updateCarrito);
      } else {
        alert("Solo puedes agregar hasta 5 unidades de este producto.");
      }
    } else {
      // Si el producto no está en el carrito, agregarlo con 1 unidad
      item.quantity = 1;
      setCarrito([...carrito, item]);
    }
  }

  // Aumentar cantidad con restricción
  function aumentarCantidad(id) {
    const updateCarrito = carrito.map(producto =>
      producto.id === id && producto.quantity < 3
        ? { ...producto, quantity: producto.quantity + 1 }
        : producto
    );
    setCarrito(updateCarrito);
  }

  // Disminuir cantidad
  function disminuirCantidad(id) {
    const updateCarrito = carrito.map(producto =>
      producto.id === id && producto.quantity > 1
        ? { ...producto, quantity: producto.quantity - 1 }
        : producto
    );
    setCarrito(updateCarrito);
  }

  // Eliminar producto
  function eliminarProducto(id) {
    const updateCarrito = carrito.filter(producto => producto.id !== id);
    setCarrito(updateCarrito);
  }

  // Vaciar carrito
  function vaciarCarrito() {
    setCarrito([]);
  }

  return (
    <>
      <Header
        carrito={carrito}
        aumentarCantidad={aumentarCantidad}
        disminuirCantidad={disminuirCantidad}
        eliminarProducto={eliminarProducto}
        vaciarCarrito={vaciarCarrito}s
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Elige lo mejor de nuestros servios</h2>
        <div className="row mt-5">
          {data.map((producto) => (
            <Producto
              key={producto.id}
              producto={producto}
              addToCart={addToCart}
            />
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default App;