export default function Tabs({ tagsOutput = [], handleTagsClick }) {
  return (
    <div className="tabrow">
      {tagsOutput.map((tag) => {
        return (
          <button
            key={tag}
            onClick={handleTagsClick}
            className="tab"
            value={tag}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
