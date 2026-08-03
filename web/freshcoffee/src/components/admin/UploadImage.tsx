import { actions } from "astro:actions";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

type UploadedImage = {
    file: string;
    link: string;
};

type Props = {
    label: string;
    currentImage?: string;
};

export default function UploadImage({
    label,
    currentImage
}: Props) {

    const [image, setImage] = useState<UploadedImage>();

    const maxFiles = 1;

    const onDrop = useCallback(async (files: File[]) => {

        const formData = new FormData();

        files.forEach(file => {
            formData.append("file", file);
        });

        const { data } = await actions.upload.uploadImage(formData);

        if (data) {
            setImage({
                file: data.file,
                link: data.link
            });
        }

    }, []);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        isDragAccept
    } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"]
        },
        maxFiles
    });

    return (
        <>
            <div className="col-span-full">

                <label
                    htmlFor="cover-photo"
                    className="block text-sm/6 font-medium text-gray-900"
                >
                    {label}
                </label>

                <div
                    {...getRootProps({
                        className: `
                            mt-2 py-20 outline-1 outline-dashed -outline-offset-1 outline-gray-300 text-center
                            ${isDragActive ? "outline-gray-900 text-gray-900 bg-gray-200" : "border-gray-400 text-gray-400 bg-white"}
                            ${isDragReject ? "border-none cursor-not-allowed" : ""}
                        `
                    })}
                >
                    <svg
                        className="mx-auto size-12 text-gray-600"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                            clipRule="evenodd"
                        />
                    </svg>

                    <input {...getInputProps()} />

                    {isDragAccept && <p>Suelta la imagen</p>}
                    {isDragReject && <p>Archivo no válido</p>}
                    {!isDragActive && (
                        <p className="text-gray-600">
                            Arrastra y suelta una imagen aquí
                        </p>
                    )}
                </div>

            </div>

            {image && (
                <div className="py-5 space-y-3 sm:col-span-3">

                    <p className="font-bold">
                        Imagen del producto:
                    </p>

                    <img
                        src={image.link}
                        alt="Imagen"
                        className="w-92"
                    />

                </div>
            )}

            {currentImage && !image && (
                <div className="py-5 space-y-3 sm:col-span-3">

                    <p className="font-bold">
                        Imagen actual:
                    </p>

                    <img
                        src={currentImage}
                        alt="Imagen"
                        className="w-92"
                    />

                </div>
            )}

            <input
                type="hidden"
                name="image"
                value={image?.link ?? currentImage ?? ""}
            />

        </>
    );

}