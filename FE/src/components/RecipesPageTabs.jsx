import React from "react";

export default function RecipesPageTabs({ tags }) {
  return (
    <div>
      {tags.map((tag) => (
        <label htmlFor={tag.name} key={tag.name}>
          <input type="checkbox" value={tag.name} />
          {tag.name}
        </label>
      ))}
    </div>
  );
}
