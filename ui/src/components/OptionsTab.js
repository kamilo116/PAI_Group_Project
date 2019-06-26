import {Link} from 'react-router-dom'
import LoginMaterialize, {ADMIN_EMAIL} from "./LoginMaterialize";
import React, {Component} from 'react';
import {connect} from "react-redux";
import {isChecked, optionValue, setCheckedOptions, setIsAdmin, setIsLogin} from "./actions/cartActions";
import PropTypes from 'prop-types';



const price_option_checkboxes = [
    {
        option: "cena",
        name: '12$',
        key: 'checkBox1',
        label: 'Check Box 1',
    },
    {
        option: "cena",
        name: '13$',
        key: 'checkBox2',
        label: 'Check Box 2',
    },
    {
        option: "cena",
        name: '14$',
        key: 'checkBox3',
        label: 'Check Box 3',
    },
    {
        option: "cena",
        name: '15$',
        key: 'checkBox4',
        label: 'Check Box 4',
    },
];

const year_option_checkboxes = [
    {
        option: "year",
        name: '2019',
        key: 'checkBox1',
        label: 'Check Box 1',
    },
    {
        option: "year",
        name: '2018',
        key: 'checkBox2',
        label: 'Check Box 2',
    },
];

const color_option_checkboxes = [
    {
        option: "color",
        name: 'amber',
        key: 'checkBox1',
        label: 'Check Box 1',
    },
    {
        option: "color",
        name: 'yellow',
        key: 'checkBox2',
        label: 'Check Box 2',
    },
    {
        option: "color",
        name: 'jaundiced',
        key: 'checkBox2',
        label: 'Check Box 2',
    },
    {
        option: "color",
        name: 'gilded',
        key: 'checkBox2',
        label: 'Check Box 2',
    },
];

const opts = [
    price_option_checkboxes, year_option_checkboxes, color_option_checkboxes
]

const Checkbox = ({ type = 'checkbox', name, checked = true, onChange }) => (
    <label><input type={type} name={name} checked={checked} onChange={onChange} /></label>
);

Checkbox.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
}


class OptionsTab extends Component {

    constructor(props) {
        super(props);

        this.state = {
            checkedItems: new Map(),
            option_value: "",
            is_checked: false
        }

        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(e) {
        const option = e.target.option;
        const item = e.target.name;
        const isChecked = e.target.checked;
        this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
        console.log(item );
        console.log( isChecked );
    }


    render() {
        return (
            <React.Fragment>
            {

                opts.map(opt => (

                    opt.map(item => (
                        <div>
                             <label>
                                 <p>
                                     <label key={item.key}    >
                                         <label>{item.option}    </label>

                                         <input type="checkbox"
                                                name={item.name} checked={this.state.checkedItems.get(item.name)}
                                               onChange={(e)=>this.handleChange(e)}/>
                                         <span>{item.name}</span>
                                     </label>
                                 </p>
                             </label>
                         </div>
                    ))
                ))
             }

             </React.Fragment>

        );
    }

}
const mapStateToProps = (state)=>{
    return {
        isAdmin: state.cartReducer.isAdmin,
        user: state.cartReducer.user
    }
}
const mapDispatchToProps= (dispatch)=>{

    return{
        setIsAdmin: (isAdmin)=>{dispatch(setIsAdmin(isAdmin))},
        setCheckedOptions: (option)=>{dispatch(setCheckedOptions(option))},
        optionValue: (option)=>{dispatch(optionValue(option))},
        isChecked: (option)=>{dispatch(isChecked(option))}
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(OptionsTab)
// export default Navbar;
