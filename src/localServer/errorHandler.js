export const errorHandler = ({
    httpRequest,
    httpResponse,
    errorMessage
}) => {


    httpResponse.setHeader('Content-Type', 'application/json');

    httpResponse.end(JSON.stringify({
        errorMessage
    }))
}