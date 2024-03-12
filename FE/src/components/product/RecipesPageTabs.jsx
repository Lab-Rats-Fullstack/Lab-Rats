import React from "react";

export default function RecipesPageTabs({ tags, setSelectedTags }) {
  async function handleClick(e){
   
    if (e.target.checked) {
    setSelectedTags((prev)=>[...prev, e.target.value])
    } else {
      setSelectedTags((prev)=> {
        const index = prev.indexOf(e.target.value)
        return prev.toSpliced(index, 1)
      })
    }
  }
  return (
    <div className="tagBox">
      <p>Filter by tags:</p>
      <div>
      {tags.map((tag) => (
        <label htmlFor={tag.name} key={tag.name}>
          <input type="checkbox" value={tag.name} onClick={handleClick}/>
          {tag.name}
        </label>
      ))}
      </div>
    </div>
  );
}
