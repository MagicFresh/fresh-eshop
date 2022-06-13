import React, {useContext} from 'react'
import {GlobalState} from '../../../GlobalState'

function Filters() {
    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories

    const [category, setCategory] = state.productsAPI.category
    const [sort, setSort] = state.productsAPI.sort
    const [search, setSearch] = state.productsAPI.search


    const handleCategory = e => {
        setCategory(e.target.value)
        setSearch('')
    }

    return (
        <div className="filter_menu">
            <div className="row">
                
                <select name="category" value={category} onChange={handleCategory} >
                    <option value=''>Все Товары</option>
                    {
                        categories.map(category => (
                            <option value={"category=" + category._id} key={category._id}>
                                {category.name}
                            </option>
                        ))
                    }
                </select>
            </div>

            <input type="text" value={search} placeholder="Поиск"
            onChange={e => setSearch(e.target.value.toLowerCase())} />

            <div className="row sort">
                
                <select value={sort} onChange={e => setSort(e.target.value)} >
                    <option value=''>Новые</option>
                    <option value='sort=oldest'>Старые</option>
                    <option value='sort=-sold'>Лучшие Продажи</option>
                    <option value='sort=-price'>Сначала Дорогие</option>
                    <option value='sort=price'>Сначала Дешевые</option>
                </select>
            </div>
        </div>
    )
}

export default Filters
