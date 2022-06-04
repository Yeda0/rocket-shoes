import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {

    
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const cartUpdate = [...cart] //Adicionando os dados do meu estado no novo array
      const productExists = cartUpdate.find(product => product.id === productId) //Verificando se o produto existe no carrinho
      
      const stockData = await api.get(`/stock/${productId}`) // Fazendo requisição para pegar os dados do estoque

      const stockAmount = stockData.data.amount // atribuindo os dados da requisição do estoque em uma nova variável 

      const currentAmount = productExists ? productExists.amount : 0  //Verificando a quantidade de produtos no carrinho, se  o produto existir no carrinho, retornar o respectivo valor, se não retornar 0

      const amountIncrement  = currentAmount + 1 // Incrementando um produto no carrinho

      if(amountIncrement  > stockAmount) { // Se a quantidade incrementada for maior do que o estoque, mostrar a falha
        toast.error('Quantidade solicitada fora de estoque');
      }

      if(productExists) { // Se o produto existir no carrinho, incrementar 1 unidade e não deixar que se repita
        productExists.amount = amountIncrement
      }else {
        const product = await api.get(`/products/${productId}`) // Fazendo requisição para buscar os dadso do produto 

        const newProduct = { // Adicionando um novo produto ao carrinho com 1 quantidade
          ...product.data, 
          amount : 1
        }

        cartUpdate.push(newProduct) // dando push do novo produto no array principal

      }

      setCart(cartUpdate) // setando o array no  meu estado
      localStorage.setItem('@RocketShoes:cart' , JSON.stringify(cartUpdate)) // salvando os dados no local storage


      // TODO
      
    } catch {
      // TODO
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
