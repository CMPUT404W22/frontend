/**
 * Identity object, contain user info
 */
class Identity {
    username = "";
    password = "";
    id = "";
    role = "";

    timezoneOffset = new Date().getTimezoneOffset();

    /**
     * Constructor
     * @param username
     * @param password
     * @param role
     * @param id
     */
    constructor(username, password, role, id) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.id = id;
    }

    /**
     * Retrieve identity from localStorage
     * @returns {Identity}
     * @constructor
     */
    static GetIdentity() {
        let username = localStorage.getItem("username");
        let password = localStorage.getItem("password");
        let role = localStorage.getItem("role");
        let id = localStorage.getItem("id");

        return new Identity(username, password, role, id);
    }

    /**
     * Clear all identity info from localStorage
     * @constructor
     */
    static ClearIdentity() {
        localStorage.clear();
    }

    /**
     * Store identity to localStorage, return true if success
     * @returns {boolean}
     * @constructor
     */
    StoreIdentity() {
        if (this.username !== "") {
            localStorage.setItem("username", this.username);
            localStorage.setItem("password", this.password);
            localStorage.setItem("role", this.role);
            localStorage.setItem("id", this.id);

            return true;
        }
        return false;
    }

    /**
     * Check if use is admin
     * @returns {boolean}
     * @constructor
     */
    IsAdmin() {
        return this.role === "admin";
    }

    /**
     * Check if use is authenticated
     * @returns {boolean}
     * @constructor
     */
    IsAuthenticated() {
        return this.username !== "" && this.username != null;
    }
}

export default Identity;