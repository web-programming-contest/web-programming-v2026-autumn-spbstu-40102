
export function getIsLoggedIn(): boolean {
    return localStorage.getItem("isLoggedIn") === "true"
}

export function logout() {
    localStorage.removeItem("isLoggedIn")
}