/**
 * from a url, get the node origin
 * @returns {string}
 */
String.prototype.getNodeOrigin = function () {
    return (this.includes("127.0.0.1") || this.includes("cmput404-w22-project-backend.herokuapp.com")) ? "local" : this.split("author")[0].slice(5);
}

String.prototype.getUUIDs = function () {
    let r = this.matchAll(new RegExp(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/g));
    return [...r];
}

String.prototype.getPostId = function () {
    let r = this.matchAll(new RegExp(/(?<=posts\/).*?(?=\/)/g));
    let result = [...r];
    if (result[0] === undefined) {
        let re = this.matchAll(new RegExp(/(?<=posts\/).*/g));
        return [...re]
    }
    return result;
}

String.prototype.getCommentId = function () {
    let r = this.matchAll(new RegExp(/(?<=comments\/).*?(?=\/)/g));
    let result = [...r];
    if (result[0] === undefined) {
        let re = this.matchAll(new RegExp(/(?<=comments\/).*/g));
        return [...re]
    }
    return result;
}

String.prototype.getAuthorId = function () {
    let r = this.matchAll(new RegExp(/(?<=authors\/).*?(?=\/)/g));
    let result = [...r];
    if (result[0] === undefined) {
        let re = this.matchAll(new RegExp(/(?<=authors\/).*/g));
        return [...re]
    }
    return result;
}


