import { useEffect, useState } from "react";
const useHttp = (api) => {
    const [data, setdata] = useState(null);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState("");

    useEffect(() => {
        fetch(api.url,
            {
                method: api.method,
            }
        )
            .then((res) => res.json())
            .then((data) => {
                seterror(data.error)
                setdata(data)
                setloading(false)
            })
    }, []);

    return { data, loading, error };
};

export default useHttp;