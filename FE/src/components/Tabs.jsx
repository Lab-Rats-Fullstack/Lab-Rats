export default function Tabs({ tagsOutput = [], handleTagsClick }) {
  return (
    <div className="tabrow">
      {tagsOutput.map((tag) => {
        return (
          <button key={tag} onClick={handleTagsClick} className="tab">
            {tag}
          </button>
        );
      })}
    </div>
  );
}
