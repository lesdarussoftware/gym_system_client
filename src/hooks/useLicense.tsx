import { useContext, useEffect, useState } from "react";

import { AuthContext } from "../providers/AuthProvider";
import { useQuery } from "./useQuery";

import { STATUS_CODES } from "../config/statusCodes";
import { GYM_URL } from "../config/urls";

export function useLicense() {

    const { auth } = useContext(AuthContext);
    const { handleQuery } = useQuery();

    const [license, setLicense] = useState({
        name: '',
        hash: '',
        next_deadline: '',
        address: '',
        city: '',
        country: ''
    })

    useEffect(() => {
        getLicense();
    }, [])

    async function getLicense() {
        if (!auth) return
        const { status, data } = await handleQuery({ url: `${GYM_URL}/${auth?.me.gym.hash}` });
        if (status === STATUS_CODES.OK) setLicense(data);
    }

    return { license }
}