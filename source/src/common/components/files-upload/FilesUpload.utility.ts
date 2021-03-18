
export type Reorder = (list: File[], startIndex: number, endIndex: number) => File[]

export const reorder: Reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}

interface Metadata {
    width: number;
    height: number;
}

export const getImageMetaData = (url: string): Promise<Metadata> => new Promise(resolve => {
    const image = new Image();
    image.src = url;
    image.onload = function () {
        // @ts-ignore
        resolve({ width: this.width, height: this.height })
    }
})
