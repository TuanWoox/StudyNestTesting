export interface Folder {
    id: string;
    folderName: string;
    ownerId: string;
    notes?: Note[];
    dateCreated?: string;
    dateModified?: string;
    deleted?: boolean;
}

export interface Tag {
    id: string;
    name: string;
    noteTags?: NoteTag[];
    dateCreated?: string;
    dateModified?: string;
    deleted?: boolean;
}

export interface NoteTag {
    noteId: string;
    tagId: string;
    tag: Tag;
    note?: Note; // Chỉ có ở ViewTag API
    dateCreated?: string;
    dateModified?: string;
    deleted?: boolean;
}

export interface Note {
    id: string;
    title: string;
    content: string;
    status: string;
    ownerId: string;
    folderId?: string;
    folder?: Folder;
    noteTags: NoteTag[];
    dateCreated?: string;
    dateModified?: string;
    deleted?: boolean;
}