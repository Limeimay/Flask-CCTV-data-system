//required libs: es6-promise(for IE), axios, element, vue 

//url: String
//success: Function(data), success callback
//query: Object
//pager: {current:Int, size:Int}
//fin: Function(onFinally), optional, finally callback
//method: 'get'/'post', optional, default: 'post'
//params: Plain Object, optional, url parameters, mostly for get method
//bussinessError: Function(error), optional, bussiness error callback
//error: Function(error), optional, error callback, override default error
//then: Function(response), optional, override default then
//debug: Boolean, optional, console.log enable for errors
function coolAjax(url, success, query, pager, fin, method, params, bussinessError, error, then, debug) {
    if (method === undefined) method = 'post'

    //todo: authorization
    //axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
    //can be set outside globally

    var promise = axios({
        method: method,
        url: url,
        data: { query: query, pager: pager },
        params: params,
        maxContentLength: 2000000000,
    })

    if (then)
        promise = promise.then(then)
    else
        promise = promise.then(function (response) {
            var data = response.data
            if (data.error) { //handle bussiness error
                if (bussinessError)
                    bussinessError(data)
                else
                    Vue.prototype.$alert(data.message)
                return
            }
            success({ data: data.data, pager: data.pager }) //callback
        })

    if (error)
        promise = promise.catch(error)
    else
        promise = promise.catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (debug) {
                    console.log('data: ', error.response.data);
                    console.log('status: ', error.response.status);
                    console.log('headers: ', error.response.headers);
                }
                Vue.prototype.$alert(error.message + ' (' + error.response.status + ')')
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                if (debug) console.log('request: ', error.request);
                Vue.prototype.$alert(error.message + ' (request)')
            } else {
                // Something happened in setting up the request that triggered an Error
                // Also can be trigger by an error in success callback
                if (debug) console.log('error.message', error.message);
                Vue.prototype.$alert(error.message + ' (others)')
            }
            if (debug) console.log('error.config: ', error.config);
        })

    if (fin) promise.finally(fin)
}