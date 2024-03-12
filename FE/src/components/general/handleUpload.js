export default async function handleUpload(formData) {
  const cloud_name = "dbwbh7oxd";
  const APIURL = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
  const response = await fetch(APIURL, {
    method: "POST",
    body: formData,
  });
  const json = await response.json();
  return json;
}
