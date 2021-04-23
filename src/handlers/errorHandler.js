
const handler = (request, response) => {
    return error => {

        response.body = {
            errorMessage: error
        }
    }
}


export default handler;