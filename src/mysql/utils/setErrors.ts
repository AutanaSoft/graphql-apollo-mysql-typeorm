import { GraphQLError } from 'graphql'

export const setGraphQLError = (message: string, errorCode: string, status = 401) => {
    throw new GraphQLError(message, {
        extensions: {
            code: errorCode.toLocaleUpperCase(),
            http: { status }
        }
    })
}
