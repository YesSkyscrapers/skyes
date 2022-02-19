const objectToParams = (object) => {
    Object.keys(object).forEach(key => object[key] === undefined ? delete object[key] : '');
    var params = "";
    for (var key in object) {
        if (params != "") {
            params += "&";
        }
        params += key + "=" + encodeURIComponent(object[key]);
    }
    return params;
}


const paramsToObject = (params) => {
    try {
        return JSON.parse('{"' + decodeURI(params).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
    } catch (error) {
        return {};
    }
}



const waitFor = (delay) => {
    return new Promise(res => {
        setTimeout(() => {
            return res()
        }, delay)
    })
}

export {
    objectToParams,
    paramsToObject,
    waitFor
}


