export enum VoteValue {
    VoteValueYes = 1,
    VoteValueMaybe = 2,
    VoteValueNo = 3,
}

export interface Vote {
    optionKey: string;
    voterName: string;
    value: VoteValue;
    created: string;
}
