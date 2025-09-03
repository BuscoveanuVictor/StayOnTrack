export default async function apiFetch(url, method = "GET", data = null) {

    const options = {
        method,
        credentials: "include",
        headers: {}
    };

    // Daca exita data atunci setam head-ul si body-ul
    if (data) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
    }else{
        delete options.headers;
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Fetch error: ",error);
        return null;
    }
}