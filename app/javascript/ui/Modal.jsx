import React, { Component } from "react";
import Transition from 'react-transition-group/Transition';

const duration = 250;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`,
  opacity: 0
}

const transitionStyles = {
  entering: { opacity: 0, transform: "translateY(40px)" },
  entered:  { opacity: 1, transform: "translateY(0)" },
  exiting:  { opacity: 1, transform: "translateY(0)" },
  exited:   { opacity: 0, transform: "translateY(40px)" }
};

export default class Modal extends Component {

	render() {
		const { isActive, closeModal } = this.props;
		const modalActiveClass = isActive ? "open" : "closed";
		const closeIcon = <svg className="close" onClick={ closeModal }>
		  <use xlinkHref="../images/close-icon.svg#close" />
		</svg>;

		return (
			<div className={`modal modal-${modalActiveClass}`}>
				<div className={`modal-overlay overlay-${modalActiveClass}`} onClick={ closeModal } />
				<Transition in={ isActive } timeout={ 0 }>
					{(state) => (
		        		<div className="modal-body" style={{
			        		...defaultStyle,
			        		...transitionStyles[state]
			      		}}>
			      		  { closeIcon }
			      		  { this.props.children }
			      		</div>
			    	)}
			  	</Transition>
			</div>
		);
	}
}
