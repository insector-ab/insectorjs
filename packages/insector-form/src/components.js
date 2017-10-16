import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {getAttrs} from 'insector-utils';

/**
 * FormTextInput
 */
export class FormTextInput extends React.Component {

    constructor(props, ...args) {
        super(props, ...args);
        this.state = {};
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.value !== nextProps.value) {
            this.setState({value: nextProps.value});
        }
    }

    onChange(event) {
        if (this.props.onChange) {
            this.props.onChange(event);
        }
        this.setState({value: event.target.value});
    }

    render() {
        const attrs = getAttrs(this.props, FormTextInput);
        attrs.className = classNames('form-control', attrs.className);
        return (
            <input
                type="text"
                value={this.props.value}
                {...attrs}
                {...this.state}
                onChange={this.onChange}
            />
        );
    }

}
FormTextInput.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};
FormTextInput.defaultProps = {
    value: ''
};

/**
 * FormPasswordInput
 */
export function FormPasswordInput(props) {
    const attrs = getAttrs(props, FormPasswordInput);
    attrs.className = classNames('form-control', attrs.className);
    return (
        <input
            type="password"
            value={props.value}
            {...attrs}
        />
    );
}
FormPasswordInput.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};
FormTextInput.defaultProps = {
    value: ''
};

/**
 * FormCheckbox
 */
export function FormCheckbox(props) {
    const attrs = getAttrs(props, FormCheckbox);
    attrs.className = classNames('checkbox', attrs.className);
    return (
        <div {...attrs}>
            <label>
                <input type="checkbox" checked={props.checked} /> {props.text}
            </label>
        </div>
    );
}
FormCheckbox.propTypes = {
    checked: PropTypes.bool
};

/**
 * FormSelect
 */
export function FormSelect(props) {
    const attrs = getAttrs(props, FormSelect);
    attrs.className = classNames('form-control', attrs.className);
    return (
        <select
            value={props.value}
            {...attrs}
        >
            {props.children}
        </select>
    );
}
FormSelect.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    children: PropTypes.node
};
FormSelect.defaultProps = {
    value: ''
};
