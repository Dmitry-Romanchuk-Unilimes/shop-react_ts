import React, { useEffect, useRef } from 'react';
import { ModalProps } from './interface';
import ReactDOM from 'react-dom';
import './style.css';

export const Modal: React.FC<ModalProps> = ({ onClickOutsideModalBody, show = true, modalBodyClassName, children }) => {
    const root = useRef(document.querySelector("#root") as HTMLDivElement);
    const el = useRef(document.createElement('div'));

    useEffect(() => {
        root.current.appendChild(el.current);

        return function cleanup() {
            root.current.removeChild(el.current);
        }
    }, []);

    const removeOnClickPropagation = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
    }

    const handleClickOutsideModalBody = () => {
        onClickOutsideModalBody && onClickOutsideModalBody();
    }

    return show ? ReactDOM.createPortal(
        <div onClick={removeOnClickPropagation} className="modal-container">
            <div onClick={handleClickOutsideModalBody} className="modal-overlay" />
            <div className={`modal-body ${modalBodyClassName || ''}`}>
                {children}
            </div>
        </div>,
        el.current
    ) : null;
}