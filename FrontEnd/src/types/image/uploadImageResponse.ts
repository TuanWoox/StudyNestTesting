interface EditorJsImageResult {
    url: string;
}

export interface UploadImageResponse {
    success: number;
    file?: EditorJsImageResult;
}