import {Option} from "./option";

export interface Group {
    key: string;
    adminKey: string;
    adminName: string;
    adminMail: string;
    title: string;
    location: string;
    description: string;
    created: string;
    updated: string;
    options: Array<Option>;
}

export type NewGroup = Omit<Group, 'key' | 'adminKey' | 'created' | 'updated'>;