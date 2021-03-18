export const makeRequest = (filter: any) => ({
    data: {
        params: {
            filter,
            orderBy: ['LastModificationDate desc'],
            select: ['Id', 'Name', 'LastModificationDate', 'CreationDate'],
        },
        pageSize: 30,
    }
})
