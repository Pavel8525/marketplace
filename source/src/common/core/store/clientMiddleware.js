const reqState = new Map();

const isCurrentAsyncOperation = (request, promise) => reqState.get(request) === promise;
const cleanupCurrentAsyncOperation = (request, promise) => isCurrentAsyncOperation(request, promise) && reqState.delete(request);

export const clientMiddleware = client =>
    ({ dispatch, getState }) =>
        next => (action) => {
            if (typeof action === 'function') {
                return action(dispatch, getState);
            }

            const { promise, terminateAsyncType, types, continueAll, ...rest } = action; // eslint-disable-line no-use-before-define
            if (terminateAsyncType) {
                reqState.delete(terminateAsyncType);
                return next(rest);
            }

            if (!promise) {
                return next(action);
            }

            const [
                REQUEST,
                SUCCESS,
                FAILURE
            ] = types;

            next({ ...rest, type: REQUEST });

            const reqPromise = promise(client);
            reqState.set(REQUEST, reqPromise);

            reqPromise
                .then(
                    result => (continueAll  || isCurrentAsyncOperation(REQUEST, reqPromise)) && next({ ...rest, payload: result, type: SUCCESS }),
                    error => (continueAll || isCurrentAsyncOperation(REQUEST, reqPromise)) && next({ ...rest, error, type: FAILURE })
                )
                .catch((error) => {
                    (continueAll || isCurrentAsyncOperation(REQUEST, reqPromise)) && next({ ...rest, error, type: FAILURE });

                    console.error('MIDDLEWARE ERROR:', error);
                    console.error('MIDDLEWARE ERROR:', error.stack);
                })
                .finally(() => cleanupCurrentAsyncOperation(REQUEST, reqState));

            return reqPromise;
        };
