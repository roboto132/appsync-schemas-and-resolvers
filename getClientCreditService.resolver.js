import { util } from '@aws-appsync/utils';

/**
 * Sends a request to a Lambda function. Passes all information about the request from the `info` object.
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {import('@aws-appsync/utils').LambdaRequest} the request
 */
export function request(ctx) {
    const { request: { headers }, arguments: args } = ctx;
    const { B2BInfoInput = {}, clientId, limit, offset } = args;

    // Extraer valores de b2bInfoInput con fallback a valores por defecto para evitar undefined.
    const {
        cpgId: inputCpgId = '',
        countryId: inputCountryId = '',
        organizationId: inputOrganizationId = '',
        transactionId: inputTransactionId = '',
        b2bSession: inputB2bSession = { Authorization: '' }
    } = B2BInfoInput;

    // Preferir valores del header si están disponibles, sino usar de b2bInfoInput.
    const authorization = headers["Authorization"] || inputB2bSession.Authorization;
    const cpgId = headers["X-Cpg-Id"] || inputCpgId;
    const countryId = headers["X-Country-Id"] || inputCountryId;
    const organizationId = headers["X-Organization-Id"] || inputOrganizationId;
    const transactionId = headers["X-Transaction-Id"] || inputTransactionId;


    // Retornar la configuración para invocar la lambda con los valores recolectados.
    return {
        operation: 'Invoke',
        payload: {
            cpgId,
            countryId,
            organizationId,
            transactionId,
            b2bSession: { Authorization: authorization },
            clientId, 
            limit, 
            offset
        }
    };
}

/**
 * Process a Lambda function response
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the Lambda function response
 */
export function response(ctx) {
    const { result, error } = ctx;
    if (error) {
        util.error(error.message, error.type, result);
    }
    return result;
}
