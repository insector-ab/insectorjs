import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import Autocomplete from 'react-autocomplete';
// import classNames from 'classnames';
import {getAttrs} from 'insector-utils';

// import 'bootstrap-datepicker';

/**
 * AbstractFormControl
 */
export class AbstractFormControl extends React.Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    get element() {
        return ReactDOM.findDOMNode(this);
    }

    getAttrs() {
        const attrs = getAttrs(this.props, this.constructor);
        attrs.onChange = this.onChange;
        attrs.onBlur = this.onBlur;
        return attrs;
    }

    onChange(event) {
        this.dispatchCustomEvent('react.change', event);
    }

    onBlur(event) {
        this.dispatchCustomEvent('react.blur', event);
    }

    dispatchCustomEvent(type, data) {
        const e = new window.CustomEvent(type, {detail: data});
        this.element.dispatchEvent(e);
    }

}
AbstractFormControl.propTypes = {
    value: PropTypes.any
};

/**
 * ReactInput
 */
export class ReactInput extends AbstractFormControl {

    render() {
        const attrs = this.getAttrs();
        return (
            <input type={this.props.type || 'text'}
                   value={this.props.value}
                   {...attrs} />
        );
    }

}
ReactInput.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};
ReactInput.defaultProps = {
    value: ''
};

/**
 * ReactTextarea
 */
export class ReactTextarea extends AbstractFormControl {

    render() {
        const attrs = this.getAttrs();
        return (
            <textarea value={this.props.value}
                      {...attrs} />
        );
    }

}
ReactTextarea.propTypes = {
    value: PropTypes.string
};
ReactTextarea.defaultProps = {
    value: ''
};

/**
 * ReactSelect
 */
export class ReactSelect extends AbstractFormControl {

    render() {
        const attrs = this.getAttrs();
        return (
            <select value={this.props.value}
                    {...attrs} >
                {this.props.children}
            </select>
        );
    }

}
ReactSelect.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    children: PropTypes.node
};
ReactSelect.defaultProps = {
    value: ''
};

// /**
//  * ReactDatepicker
//  */
// export class ReactDatepicker extends ReactInput {

//     constructor(props) {
//         super(props);
//         this.onDateChange = this.onDateChange.bind(this);
//         this.onShow = this.onShow.bind(this);
//         this.onHide = this.onHide.bind(this);
//     }

//     componentDidMount() {
//         // Datepicker instance
//         if (!this.datepicker) {
//             const $el = $(ReactDOM.findDOMNode(this));
//             this.datepicker = $el.datepicker({
//                 format: 'yyyy-mm-dd',
//                 weekStart: 1,
//                 autoclose: true
//             });
//             this.datepicker.on('changeDate', this.onDateChange);
//             this.datepicker.on('show', this.onShow);
//             this.datepicker.on('hide', this.onHide);
//         }
//     }

//     componentWillUnmount() {
//         if (this.datepicker) {
//             this.datepicker.off(undefined, undefined, this);
//             delete this.datepicker;
//         }
//     }

//     onChange(event) {
//         // disable onChange behaviour
//     }

//     onDateChange(event) {
//         super.onChange(event);
//     }

//     onShow(event) {
//         this.dispatchEvent(event, 'react.datepicker.show');
//         // this.$el.trigger('react.datepicker.show', [event, this]);
//     }

//     onHide(event) {
//         this.dispatchEvent(event, 'react.datepicker.hide');
//         // this.$el.trigger('react.datepicker.hide', [event, this]);
//     }

// }
// ReactDatepicker.propTypes = {
//     value: PropTypes.string
// };

// /**
//  * ReactToggle
//  */
// export class ReactToggle extends ReactInput {

//     componentDidMount() {
//         // bootstrapToggle instance
//         if (!this.toggle) {
//             const $el = $(ReactDOM.findDOMNode(this));
//             this.toggle = $el.bootstrapToggle({
//                 on: 'Yes',
//                 off: 'No',
//                 onstyle: 'success',
//                 offstyle: 'warning',
//                 size: 'small'
//             });
//             this.toggle.on('change', this.onChange);
//         }
//     }

//     componentWillUnmount() {
//         delete this.toggle;
//     }

// }
// ReactToggle.propTypes = {
//     value: PropTypes.string
// };
// ReactToggle.defaultProps = {
//     type: 'checkbox'
// };

// /**
//  * ReactAutocomplete
//  */
// export class ReactAutocomplete extends AbstractFormControl {

//     constructor(props) {
//         super(props);
//         this.onSelect = this.onSelect.bind(this);
//         this.onChange = this.onChange.bind(this);
//     }

//     render() {
//         const p = this.props;
//         // use default values
//         const defaultProps = this.constructor.defaultProps;
//         const wrapperProps = Object.assign({}, defaultProps.wrapperProps, p.wrapperProps);
//         const inputProps = Object.assign({}, defaultProps.inputProps, p.inputProps);
//         // wrapper className
//         if (wrapperProps.className && p.className) {
//             wrapperProps.className += ' ' + p.className;
//         } else if (p.className) {
//             wrapperProps.className = p.className;
//         }
//         return (
//             <Autocomplete ref="autocomplete"
//                           onChange={this.onChange}
//                           onSelect={this.onSelect}
//                           value={p.value ? p.value : ''}
//                           items={p.items}
//                           shouldItemRender={p.shouldItemRender}
//                           getItemValue={p.getItemValue}
//                           renderItem={p.renderItem}
//                           renderMenu={p.renderMenu}
//                           inputProps={inputProps}
//                           wrapperProps={wrapperProps} />
//         );
//     }

//     onSelect(value, item) {
//         // dispatch, no event available
//         this.dispatchEvent(undefined, 'react.autocomplete.select', value, item);
//     }

//     onChange(event, value) {
//         this.dispatchEvent(event, 'react.change');
//     }

// }
// // Autocomplete.propTypes = {
// //     value: PropTypes.any,
// //     onChange: PropTypes.func,
// //     onSelect: PropTypes.func,
// //     shouldItemRender: PropTypes.func,
// //     sortItems: PropTypes.func,
// //     getItemValue: PropTypes.func.isRequired,
// //     renderItem: PropTypes.func.isRequired,
// //     renderMenu: PropTypes.func,
// //     menuStyle: PropTypes.object,
// //     inputProps: PropTypes.object,
// //     wrapperProps: PropTypes.object,
// //     wrapperStyle: PropTypes.object,
// //     autoHighlight: PropTypes.bool,
// //     onMenuVisibilityChange: PropTypes.func,
// //     open: PropTypes.bool,
// //     debug: PropTypes.bool
// // }
// ReactAutocomplete.propTypes = {
//     className: PropTypes.string,
//     noValueText: PropTypes.string,
//     value: PropTypes.any,
//     items: PropTypes.array,
//     shouldItemRender: PropTypes.func,
//     sortItems: PropTypes.func,
//     getItemValue: PropTypes.func.isRequired,
//     renderItem: PropTypes.func.isRequired,
//     renderMenu: PropTypes.func,
//     inputProps: PropTypes.object,
//     wrapperProps: PropTypes.object
// };
// ReactAutocomplete.defaultProps = {
//     shouldItemRender: function(item, value) {
//         return item.name && item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
//     },
//     getItemValue: function(item) {
//         return item.name;
//     },
//     renderItem: function(item, isHighlighted) {
//         const classes = classNames({'active': isHighlighted});
//         return (
//             <li className={classes}
//                  key={item.id}
//                  id={item.id}>
//                 <span>{item.name}</span>
//             </li>
//         );
//     },
//     renderMenu: function(items, value, style) {
//         let children = items;
//         // TODO: use noValueText from props
//         if (children.length === 0) {
//             children = <li><span className="text-novalue">No items matched</span></li>;
//         }
//         return (
//             <ul className="dropdown-menu">
//                 {children}
//             </ul>
//         );
//     },
//     inputProps: {name: 'autocomplete', 'className': 'form-control'},
//     wrapperProps: {className: 'autocomplete'}
// };