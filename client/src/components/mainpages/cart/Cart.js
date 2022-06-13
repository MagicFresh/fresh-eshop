import React, {useContext, useState, useEffect} from 'react'
import {GlobalState} from '../../../GlobalState'
import axios from 'axios'
import PaypalButton from './PaypalButton'

function Cart() {
    const state = useContext(GlobalState)
    const [cart, setCart] = state.userAPI.cart
    const [token] = state.token
    const [total, setTotal] = useState(0)

    useEffect(() =>{
        const getTotal = () =>{
            const total = cart.reduce((prev, item) => {
                return prev + (item.price * item.quantity)
            },0)

            setTotal(total)
        }

        getTotal()

    },[cart])

    const addToCart = async (cart) =>{
        await axios.patch('/user/addcart', {cart}, {
            headers: {Authorization: token}
        })
    }


    const increment = (id) =>{
        cart.forEach(item => {
            if(item._id === id){
                item.quantity += 1
            }
        })

        setCart([...cart])
        addToCart(cart)
    }

    const decrement = (id) =>{
        cart.forEach(item => {
            if(item._id === id){
                item.quantity === 1 ? item.quantity = 1 : item.quantity -= 1
            }
        })

        setCart([...cart])
        addToCart(cart)
    }

    const removeProduct = id =>{
        if(window.confirm("Хотите убрать этот товар?")){
            cart.forEach((item, index) => {
                if(item._id === id){
                    cart.splice(index, 1)
                }
            })

            setCart([...cart])
            addToCart(cart)
        }
    }

    const tranSuccess = async(payment) => {
        const {paymentID, address} = payment;

        await axios.post('/api/payment', {cart, paymentID, address}, {
            headers: {Authorization: token}
        })

        setCart([])
        addToCart([])
        alert("Вы успешно оформили заказ, в скором времени с вами свяжутся.")
    }


    if(cart.length === 0) 
        return <h2 style={{textAlign: "center", fontSize: "5rem"}}>Корзина Пустая</h2> 

    return (
        <div className="Container">
            <div className="Info">
            {
                cart.map(product => (
                    <div className="product" key={product._id}>
                    <div className="detail cart">
                        <img src={product.images.url} alt="" />
                        <div className="info_product">
                        <div className="box-detail">
                            <h3>{product.title}</h3>
                            <p>{product.description}</p>
                            <h5>Размер: {product.size}</h5>
                            </div>
                        <div className="price">
                            <div className="amount">
                                <button onClick={() => decrement(product._id)}> - </button>
                                <span>{product.quantity}</span>
                                <button onClick={() => increment(product._id)}> + </button>
                            </div>
                            <p>Цена Товара:<b> {product.price * product.quantity} Br</b></p>
                        </div>
                            <div className="delete" 
                            onClick={() => removeProduct(product._id)}>
                                X
                            </div>
                        </div>
                    </div>
                    </div>
                ))
            }
            </div>
            <div className="total">
                <h2>Описание Заказа</h2>
                <h3>Цена всех товаров: {total} Br</h3>
                <h3>Стоимость Доставки: -5 Br</h3>
                <h3>Весеняя Скидка: 5 Br</h3>
                <h3>Итог: {total} Br</h3>
                <PaypalButton
                total={total}
                tranSuccess={tranSuccess} />
            </div>
        </div>
    )
}

export default Cart
