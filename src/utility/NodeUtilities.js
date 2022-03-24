/**
 * from a url, get the node origin
 * @returns {string}
 */
String.prototype.getNodeOrigin = function () {
    return (this.includes("127.0.0.1") || this.includes("cmput404-w22-project-backend.herokuapp.com")) ? "local" : this.split("author")[0];
}