import { useState, useEffect } from "react";

export default function FormTags({ tagsList, setTagsList, setDisabled }) {
  const API = "https://culinary-chronicle.onrender.com/api";
  const [tags, setTags] = useState([]);

  useEffect(()=>{
    const potentialBlankTag = tagsList.find((singleTag) => {
      return (singleTag.tag.replaceAll(' ', '') == '');
    });
    if(potentialBlankTag){
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    console.log("tagsList", tagsList);
  }, [tagsList])

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

  function handleTagChange(value, index) {
        const newList = tagsList.map((singleTag, i)=>{
          if((i == index)){
            singleTag.tag = value;
            return singleTag;
          } else {
            return singleTag;
          }
        });
        setTagsList(newList);
  }

  function handleTagDelete(index) {
    const list = [...tagsList];
    list.splice(index, 1);
    setTagsList(list);
  }

  function handleTagAdd() {
    // sets the initial value for new tag selects
    setTagsList([...tagsList, { tag: tags[0]?.name, selectMode: true}]);
  }

  function changeModeOnSingleTag(e,index){
    e.preventDefault();
    const newList = tagsList.map((singleTag, i)=>{
      if((i == index)){
        if(singleTag.selectMode){
          singleTag.tag = '';
          singleTag.selectMode = false;
        } else {
          singleTag.tag = 'Main';
          singleTag.selectMode = true;
        }
        return singleTag;
      } else {
        return singleTag;
      }
    });

    setTagsList(newList);
  }

  return (
    <>
      <div>
        <label>Tags: </label>
        {tagsList.map((singleTag, index) => {
          return (
            <div key={index}>
              {singleTag.selectMode ?
                <>
                  <button onClick={(e)=>changeModeOnSingleTag(e,index)}>Write your own tag</button>
                      <select
                      id="tags"
                      value={singleTag.tag}
                      onChange={(e) => handleTagChange(e.target.value, index)}
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
                </>
              :
              <>
                <button onClick={(e)=>changeModeOnSingleTag(e,index)}>Select an existing tag</button>
                     <label>
                        <input autoFocus type="text" value={singleTag.tag} onChange={(e) => handleTagChange(e.target.value, index)}/>
                      </label>
              </>
              }
              {tagsList.length > 1 && (
                <button type="button" onClick={() => handleTagDelete(index)} className="createFormButton">
                  -
                </button>
              )}
              {tagsList.length - 1 === index && tagsList.length < 5 && (
                <button type="button" onClick={handleTagAdd} className="createFormButton">
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
