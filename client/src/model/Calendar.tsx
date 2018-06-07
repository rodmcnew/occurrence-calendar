export default interface Calendar {
    id: string;
    authorization: string;
    occurrences: Array<string>;
    createdDate: Date;
    modifiedDate: Date;
}
