function createImageFromBlob(
  img: Blob,
  setImage: React.Dispatch<React.SetStateAction<string | undefined>>
) {
  const reader = new FileReader();
  reader.addEventListener(
    "load",
    () => {
      if (reader.result) setImage(reader.result as string);
    },
    false
  );
  reader.readAsDataURL(img);
}

export default createImageFromBlob;
