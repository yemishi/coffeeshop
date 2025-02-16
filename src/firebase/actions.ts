import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
} from "firebase/storage";
import { analytics } from "./firebase-config";

async function uploadImg(
    file: FileList
): Promise<{ error: boolean; message: string; url?: string }> {
    try {
        console.log(file)
        if (!file[0].type.startsWith("image/"))
            return {
                error: true,
                message: "Insert a valid image",
            };

        const fileRef = ref(
            analytics,
            `coffeeshop/${file[0].name}?uploadAt=${new Date().getTime()}`
        );
        const upload = (await uploadBytes(fileRef, file[0]).then((res) =>
            getDownloadURL(res.ref).then((url) => url)
        )) as string;
        return { error: false, message: "Image uploaded successfully.", url: upload };
    } catch (error) {
        console.log(error)
        return {
            error: true,
            message: "Image upload failed.",
        };
    }
}

async function deleteImg(
    url: string
): Promise<{ error: boolean; message: string }> {
    try {
        const fileRef = ref(analytics, url);
        await deleteObject(fileRef);
        return {
            error: false,
            message: "Image deleted successfully.",
        };
    } catch (error) {
        return {
            error: true,
            message: "Image deleted failed.",
        };
    }
}

export { deleteImg, uploadImg }