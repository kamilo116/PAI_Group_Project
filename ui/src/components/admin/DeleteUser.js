// import React, {Component} from 'react';
// import "../../style/style.css";
// import {Link} from "react-router-dom";
// import {getCategories, getProducts, setUser, getUsers} from "../../utils/get-api";
// import {deleteProduct, deleteUser} from "../../utils/delete-api";
//
//
// class DeleteUser extends Component {
//     constructor() {
//         super()
//         this.state = {
//             users: [],
//             deletedUserId: 0,
//         };
//     }
//
//     componentDidMount() {
//         this.getUsers()
//     }
//
//
//     getUsers() {
//         getUsers().then((users) => {
//             this.setState({users: users});
//         });
//     }
//
//
//
//     handleDeleteAction(user_id) {
//         setUser().then(user=>{
//             if(user[0].id !== user_id){
//                 deleteUser(user_id)
//                 this.setState({deletedUserId: user_id})
//             }else {
//                 alert("You cannot delete yourself")
//             }
//         })
//     }
//
//     render() {
//         const {users} = this.state;
//         if (this.state.deletedUserId !== 0) {
//             var index = users.findIndex(obj => obj.id === this.state.deletedUserId);
//             users.splice(index, 1)
//         }
//         let itemList = users.map(item => {
//             return (
//                 <div className="card" key={item.id}>
//                     <div className="card-image">
//                         <a onClick={() => this.handleDeleteAction(item.id)}
//                            className="waves-effect waves-teal btn-flat">Delete</a>
//                     </div>
//                     <div className="card-content">
//                         <span className="card-title">{item.name}</span>
//                         <p>{item.surname}</p>
//                         <p>{item.email}</p>
//                     </div>
//                 </div>
//             )
//         })
//         return (
//             <div className="container">
//                 <div className="box">
//                     {itemList}
//                 </div>
//             </div>
//         )
//     }
//
// };
// export default (DeleteUser);
