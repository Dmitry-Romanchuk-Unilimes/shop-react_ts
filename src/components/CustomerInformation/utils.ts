import React from "react";
import { CustomerInformationField, CUSTOMER_INFORMATION_FIELDS_LIST } from "../../constants/user";
import { CustomerInformationFieldRefs } from "./interface";

export const initializeFieldRefs = () => {
    const refs = {} as CustomerInformationFieldRefs;

    Object.keys(CUSTOMER_INFORMATION_FIELDS_LIST).forEach(key => {
        const stateKey = key as CustomerInformationField;
        refs[stateKey] = React.createRef();
    });

    return refs;
}