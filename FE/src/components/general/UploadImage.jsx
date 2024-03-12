export default function UploadImage({ setFormData, setImage }) {
  function handleChange(e) {
    const preset_key = "jcpaub7o";
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset_key);
    setImage(URL.createObjectURL(file));
    setFormData(formData);
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
