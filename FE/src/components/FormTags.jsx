import { useState, useEffect } from "react";

export default function FormTags({ tagsList, setTagsList }) {
  const API = "https://culinary-chronicle.onrender.com/api";
  const [tags, setTags] = useState([]);

  useEffect(() => {
    async function getTags() {
      try {
        const response = await fetch(`${API}/tags/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setTags(result.rows);
      } catch (error) {
        console.error(error);
      }
    }
    getTags();
  }, []);

  function handleTagChange(e, index) {
    e.preventDefault();
    const { name, value } = e.target;
    const list = [...tagsList];
    list[index][name] = value;
    setTagsList(list);
  }

  function handleTagDelete(index) {
    const list = [...tagsList];
    list.splice(index, 1);
    setTagsList(list);
  }

  function handleTagAdd() {
    // sets the initial value for new tag selects
    setTagsList([...tagsList, { tag: tags[0]?.name }]);
    console.log(tagsList);
  }

  //   sets initial values for tag options
  useEffect(() => setTagsList([{ tag: tags[0]?.name }]), []);

  return (
    <>
      <div>
        <label>Tags: </label>
        {tagsList.map((singleTag, index) => {
          return (
            <div key={singleTag.tag}>
              <select
                id="tags"
                value={singleTag.tag}
                onChange={(e) => handleTagChange(e, index)}
                name="tag"
              >
                {tags.map((tag) => {
                  return (
                    <option value={tag.name} key={tag.name + index}>
                      {tag.name}
                    </option>
                  );
                })}
              </select>
              {tagsList.length > 1 && (
                <button type="button" onClick={() => handleTagDelete(index)}>
                  -
                </button>
              )}
              {tagsList.length - 1 === index && tagsList.length < 5 && (
                <button type="button" onClick={handleTagAdd}>
                  +
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
