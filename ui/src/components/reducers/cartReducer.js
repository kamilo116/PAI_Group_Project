
import {
    ADD_TO_CART,
    REMOVE_ITEM,
    SUB_QUANTITY,
    ADD_QUANTITY,
    ADD_SHIPPING,
    ADD_ORDER_STATE, CLEAR_ADDED_ITEMS, SET_IS_ADMIN, SET_IS_LOGIN
} from '../actions/action-types/cart-actions'


const initState = {
    items: [],
    addedItems:[],
    order: [],
    total: 0,
    isAdmin: false,
    isLogin: false

};


const cartReducer = (state = initState,action)=>{

    //INSIDE HOME COMPONENT
    if(action.type === ADD_TO_CART){
        let addedItem = action.product;
        //check if the action id exists in the addedItems
        let existed_item= state.addedItems.find(item=> action.product.id === item.id);
        if(existed_item)
        {
            // TODO zmiana
            // addedItem.quantity += 1;
            existed_item.quantity += 1;
            return{
                ...state,
                total: state.total + existed_item.price
            }
        }
        else{
            addedItem.quantity = 1;
            //calculating the total
            // TODO zmiana
            let newTotal = state.total + addedItem.price;

            return{
                ...state,
                addedItems: [...state.addedItems, addedItem],
                total : newTotal
            }

        }
    }
    if(action.type === REMOVE_ITEM){
        let itemToRemove= action.product;
        let new_items = state.addedItems.filter(item=> action.product.id !== item.id);

        //calculating the total
        let newTotal = state.total - (itemToRemove.price * itemToRemove.quantity );
        console.log(itemToRemove);
        return{
            ...state,
            addedItems: new_items,
            total: newTotal
        }
    }
    //INSIDE CART COMPONENT
    if(action.type=== ADD_QUANTITY){
        // TODO zmiana
        // let addedItem = state.items.find(item=> item.id === action.id);
        let addedItem = action.product;
        addedItem.quantity += 1;
        let newTotal = state.total + addedItem.price;
        return{
            ...state,
            total: newTotal
        }
    }
    if(action.type=== SUB_QUANTITY){
        let addedItem = action.product;
        //if the qt == 0 then it should be removed
        if(addedItem.quantity === 1){
            let new_items = state.addedItems.filter(item=>item.id !== action.product.id);
            let newTotal = state.total - addedItem.price;
            return{
                ...state,
                addedItems: new_items,
                total: newTotal
            }
        }
        else {
            addedItem.quantity -= 1;
            let newTotal = state.total - addedItem.price;
            return{
                ...state,
                total: newTotal
            }
        }

    }

    if(action.type=== ADD_SHIPPING){
        return{
            ...state,
            total: state.total + 6
        }
    }

    if(action.type=== 'SUB_SHIPPING'){
        return{
            ...state,
            total: state.total - 6
        }
    }

    if (action.type === ADD_ORDER_STATE) {
        let newOrder = action.order;
        return {
                ...state,
                order: newOrder
            };
    }

    if (action.type === CLEAR_ADDED_ITEMS) {
        return {
            ...state,
            addedItems: [],
            order: [],
            total: 0
        };
    }

    if (action.type === SET_IS_ADMIN) {
        return {
            ...state,
            isAdmin: action.isAdmin
        };
    }

    if (action.type === SET_IS_LOGIN) {
        return {
            ...state,
            isLogin: action.isLogin
        };
    }

    return {
        ...state
    };
};

export default cartReducer