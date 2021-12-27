import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useLayoutEffectOnUpdate } from '../../customHooks/useLayoutEffectOnUpdate';
import { INITIAL_CHILDRE_POSITION } from './constant';
import { PopoverChildrenPosition, PopoverProps } from './interface';
import './style.css';

const Popover: React.FC<PopoverProps> = ({ children, controlShow, onClick, content, position, popoverBodyClassName }) => {
    const root = useRef(document.querySelector('#root') as HTMLDivElement);
    const el = useRef(document.createElement('div'));
    const childrenRef = useRef<HTMLElement>(null);
    const popperRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(false);
    const [contentWidth, setContentWidth] = useState(0);
    const [childrenPosition, setChildrenPosition] = useState<PopoverChildrenPosition>(INITIAL_CHILDRE_POSITION);
    const currentShow = controlShow === undefined ? show : controlShow;

    const handleContentClick = () => {
        controlShow === undefined && setShow(!show);

        onClick && onClick();
    }

    const ChildrenComponent = React.cloneElement(children as React.ReactElement, { ref: childrenRef, onClick: handleContentClick });

    useEffect(() => {
        root.current.appendChild(el.current);
        setTimeout(() => {
            const childrenElement = childrenRef.current;

            if (childrenElement) {
                const { top, left, right, bottom } = childrenElement.getBoundingClientRect();

                setChildrenPosition({
                    top,
                    left,
                    bottom,
                    right,
                })
            }
        }, 500)

        return function cleanup() {
            root.current.removeChild(el.current);
        }
    }, []);
    
    useLayoutEffectOnUpdate(() => {
        const popperWidth = popperRef.current ?
            popperRef.current.getBoundingClientRect().width : 0;

        if ((!contentWidth || popperWidth !== contentWidth) && currentShow) {
            setContentWidth(popperWidth);
        }
    });

    const renderPopover = () => {
        let style: React.CSSProperties;

        switch (position) {
            case 'bottomleft':
                style = {
                    top: childrenPosition.bottom,
                    left: childrenPosition.right - contentWidth
                };
                break;
            case 'bottomright':
                style = {
                    top: childrenPosition.bottom,
                    left: childrenPosition.left
                };
                break;
        }

        return currentShow ? ReactDOM.createPortal(
            <div
                style={style}
                className="popover-content-container"
                ref={popperRef}
            >
                <div className={`popover-body ${popoverBodyClassName || ''}`}>
                    {content}
                </div>
            </div>,
            el.current
        ) : null;
    }

    return (
        <React.Fragment>
            {ChildrenComponent}
            {renderPopover()}
        </React.Fragment>
    );
}

export default Popover;