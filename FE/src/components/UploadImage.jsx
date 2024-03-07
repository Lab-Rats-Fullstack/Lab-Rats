export default function UploadImage({ setEncoded }) {
  function handleChange(e) {
    const encode = encodeImageFileAsURL(e.target.files[0]);
    console.log(encode);
  }

  function encodeImageFileAsURL(file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      setEncoded({ base64: reader.result });
    };
    reader.readAsDataURL(file);
  }

  return (
    <input
      type="file"
      name="image"
      id="image"
      accept="image/*"
      onChange={handleChange}
    />
  );
}
