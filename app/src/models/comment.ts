export interface Comment {
    key: string;
    authorName: string;
    comment: string;
    created: string;
}

export type NewComment = Omit<Comment, 'key' | 'created'>;