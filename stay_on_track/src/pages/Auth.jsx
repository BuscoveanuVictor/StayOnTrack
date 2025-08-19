const API_URL = process.env.REACT_APP_API_URL;

export default function Auth() {
    console.log(API_URL)
    window.location.href = `${API_URL}/auth/google`;
}