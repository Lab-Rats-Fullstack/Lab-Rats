export default function UploadImage({ setEncoded }) {
  function handleChange(e) {
    const encode = encodeImageFileAsURL(e.target.files[0]);
    setEncoded(encode);
  }

  function encodeImageFileAsURL(file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      setEncoded(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return <input type="file" name="file" id="file" onChange={handleChange} />;
}
