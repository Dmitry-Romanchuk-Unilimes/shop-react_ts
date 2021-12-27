import React, { useMemo, useRef, useState } from 'react';
import ShopAPI from '../../api/shopAPI';
import { ROUTE } from '../../constants/route';
import { CustomerInformationField, CustomerInformationFieldsList, CUSTOMER_INFORMATION_FIELDS_LIST, CUSTOMER_INFORMATION_FIELD_ERROR, CUSTOMER_INFORMATION_FIELD_INITIAL_STATE, CUSTOMER_INFORMATION_FIELD_WIDTH } from '../../constants/user';
import { Button } from '../../ui-components/Button';
import { Input } from '../../ui-components/Input';
import { Modal } from '../../ui-components/Modal';
import { omit } from '../../utils/helper';
import { CustomerInformationFieldRefs, CustomerInformationProps, CustomerInformationState } from './interface';
import './style.css';
import update from 'immutability-helper';
import { initializeFieldRefs } from './utils';

const CustomerInformation: React.FC<CustomerInformationProps> = ({ cart, history, cleanCart }) => {
    const fieldsList = useMemo(() => Object.keys(CUSTOMER_INFORMATION_FIELDS_LIST), []);
    const initialFieldRefs = useMemo(initializeFieldRefs, []);
    const fieldRefs = useRef<CustomerInformationFieldRefs>(initialFieldRefs);
    const [fieldState, setFieldState] = useState<CustomerInformationFieldsList>({ ...CUSTOMER_INFORMATION_FIELD_INITIAL_STATE });
    const [fieldError, setFieldError] = useState<CustomerInformationFieldsList>({ ...CUSTOMER_INFORMATION_FIELD_INITIAL_STATE });
    const [hasCompletePurchaseClick, setHasCompletePurchaseClick] = useState(false);
    const [showThankyouModal, setShowThankyouModal] = useState(false);

    const validateInputField = (field: CustomerInformationField, value: string) => {
        const errorMessage = value ? '' : CUSTOMER_INFORMATION_FIELD_ERROR;

        setFieldError(update(fieldError, { [field]: { $set: errorMessage } }));
    }

    const handleInputOnChange = (field: CustomerInformationField) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;

        setFieldState(update(fieldState, { [field]: { $set: value } }));

        hasCompletePurchaseClick && validateInputField(field, value);
    }

    const renderInputFields = () => {
        return fieldsList.map(field => {
            const customerInfoField = field as CustomerInformationField;
            const label = CUSTOMER_INFORMATION_FIELDS_LIST[customerInfoField];

            return (
                <Input
                    key={label}
                    inputContainerStyle={{ marginBottom: '10px' }}
                    inputStyle={{ width: CUSTOMER_INFORMATION_FIELD_WIDTH }}
                    label={label}
                    onChange={handleInputOnChange(customerInfoField)}
                    error={fieldError[customerInfoField]}
                    positive={!!fieldState[customerInfoField]}
                    inputRef={fieldRefs.current[customerInfoField]}
                />
            )
        })
    }

    const allFieldsAreValid = () => {
        let hasError = false;
        const error: CustomerInformationFieldsList = {
            ...CUSTOMER_INFORMATION_FIELD_INITIAL_STATE
        };

        let hasFocusToErrorField = false;

        fieldsList.forEach(key => {
            const stateKey = key as CustomerInformationField;

            if (!fieldState[stateKey]) {
                error[stateKey] = CUSTOMER_INFORMATION_FIELD_ERROR;
                hasError = true;

                if (!hasFocusToErrorField) {
                    hasFocusToErrorField = true;
                    const fieldRef = fieldRefs.current[stateKey];
                    fieldRef.current && fieldRef.current.focus();
                }
            }
        });

        setFieldError(error);

        return !hasError;
    }

    const handleButtonClick = () => {
        setHasCompletePurchaseClick(true);

        if (allFieldsAreValid()) {
            const shopApi = new ShopAPI();

            shopApi.postOrder({
                cart,
                user: fieldState
            }).then(() => {
                setShowThankyouModal(true);
            })
        }
    }

    const handleShopMoreClick = () => {
        cleanCart();
        history.push(ROUTE.ALL_PRODUCTS);
    }

    return (
        <div className="customer-info-container">
            <div className="heading text">Billing Information</div>
            {renderInputFields()}
            <Button
                style={{ width: CUSTOMER_INFORMATION_FIELD_WIDTH }}
                type="primary"
                onClick={handleButtonClick}
                className="complete-purchase-btn"
            >
                Complete Purchase
                </Button>
            <Modal modalBodyClassName="customer-info-modal-body" show={showThankyouModal}>
                <div className="header">Thank you! We have received your order!</div>
                <p>Please wait 5 to 10 business days for your items to arrived.</p>
                <Button type="primary" onClick={handleShopMoreClick} >Shop More</Button>
            </Modal>
        </div>
    );
}

export default CustomerInformation;