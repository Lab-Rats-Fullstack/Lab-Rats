import React from "react";

export default function RecipesPageTabs({ tags, setTags, setSelectedTags }) {
  async function handleClick(tagId){
    const tagClicked = tags.find((tag) => {
        return tag.id == tagId;
    })
    
    let nextTags=[];

    if (tagClicked.checked){
      nextTags = tags.map((tag)=>{
        if(tag.id == tagClicked.id){
          return {
            ...tag,
            checked: false
          }
        } else {
          return tag;
        }
      });
    } else {
      nextTags = tags.map((tag)=>{
        if(tag.id == tagClicked.id){
          return {
            ...tag,
            checked: true
          }
        } else {
          return tag;
        }
      });
    }

    setTags(nextTags);

    const checkedTags = nextTags.filter((tag)=>{
      return tag.checked;
    })

    const nextSelectedTags = checkedTags.map((tag)=>{
          return tag.name;
    })

    setSelectedTags(nextSelectedTags);
  }

  function clearSelectedTags(){
    const nextTags = tags.map((tag)=>{
      return {
        ...tag,
        checked: false
      }
    });

    setTags(nextTags);

    const checkedTags = nextTags.filter((tag)=>{
      return tag.checked;
    })

    const nextSelectedTags = checkedTags.map((tag)=>{
          return tag.name;
    })

    setSelectedTags(nextSelectedTags);
  }

  return (
    <div className="tagBox">
      <p>Filter by tags:</p>
      <div>
      {tags.map((tag) => (
        <label htmlFor={tag.name} key={tag.name}>
          <input type="checkbox" value={tag.name} checked={tag.checked} onChange={()=>handleClick(tag.id)}/>
          {tag.name}
        </label>
      ))}
      </div>
      <button className="clearSelectedTags" onClick={clearSelectedTags}>Clear All Selected Tags</button>
    </div>
  );
}
