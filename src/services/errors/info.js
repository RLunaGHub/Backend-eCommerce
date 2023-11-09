export const generateProductErrorInfo = product => {
	return `Entrada incompleta o no válida.
  Propiedades requeridas:
    * title : requiere un String, recibió ${product.title}
    * description : requiere un String, recibió ${product.description}
    * category : requiere un String, recibió ${product.category}
    * price : requiere Number, recibió ${product.price}
    * stock : requiere Number, recibió ${product.stock}
    * code : requiere String, recibió ${product.code}
  `;
};

export const generateUserErrorInfo = user => {
	return `Entrada incompleta o no válida.
  Propiedades requeridas:
    * firts_name : requiere String, recibió ${user.first_name}
    * last_name : requiere String, recibió ${user.last_name}
    * age : requiere Number, recibió ${user.age}
    * email : requiere un String, recibió ${user.email}
    * password : requiere un String, recibió ${user.password}
  `;
};