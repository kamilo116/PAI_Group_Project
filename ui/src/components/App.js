// import React, {Component} from 'react';
// import {Header} from './Header';
// import {Products} from './Products';
// import {Categories} from './Categories';
// import {Basket} from './Basket';
// import {getBasket} from '../utils/get-api';
// import AddCategory from './AddCategory';
// import AddProduct from './AddProduct';
//
// class App extends Component {
//
//   constructor() {
//     super()
//     this.state = {
//       basketItems: 0,
//       viewID: 0
//     };
//     this.updateBasket = this
//       .updateBasket
//       .bind(this);
//     this.switchView = this
//       .switchView
//       .bind(this);
//     this.getBasket = this
//       .getBasket
//       .bind(this);
//   }
//
//   updateBasket(val) {
//     if (val !== undefined) {
//       this.setState({basketItems: val})
//     } else {
//       this.setState({
//         basketItems: this.state.basketItems + 1
//       })
//     }
//   }
//
//   getBasket() {
//     getBasket().then((basket) => {
//       this.updateBasket(basket.length);
//     });
//   }
//
//   componentDidMount() {
//     this.getBasket();
//   }
//
//   switchView(stateID) {
//     this.setState({viewID: stateID})
//   }
//
//   render() {
//     if (this.state.viewID === 0) {
//       return (
//         <div>
//           <Header
//             loginData={this.props.location.query}
//             basketData={this.state.basketItems}
//             switchView={this.switchView}/>
//           <Products updateBasket={this.updateBasket}/>
//         </div>
//       );
//     } else if (this.state.viewID === 1) {
//       return (
//         <div>
//           <Header
//             loginData={this.props.location.query}
//             basketData={this.state.basketItems}
//             switchView={this.switchView}/>
//           <Basket basketChanged={this.getBasket}/>
//         </div>
//       );
//     } else if (this.state.viewID === 2) {
//       return (
//         <div>
//           <Header
//             loginData={this.props.location.query}
//             basketData={this.state.basketItems}
//             switchView={this.switchView}/>
//           <AddCategory/>
//         </div>
//       );
//     } else if (this.state.viewID === 3) {
//       return (
//         <div>
//           <Header
//             loginData={this.props.location.query}
//             basketData={this.state.basketItems}
//             switchView={this.switchView}/>
//           <AddProduct/>
//         </div>
//       );
//     } else if(this.state.viewID === 4) {
//       return (
//         <div>
//           <Header
//               loginData={this.props.location.query}
//               basketData={this.state.basketItems}
//               switchView={this.switchView}/>
//           <Categories/>
//         </div>
//       );
//     }
//   }
// }
//
// export default App;