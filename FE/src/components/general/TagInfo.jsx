import React from "react";
import { Link } from "react-router-dom";

export default function TagInfo({ tag }) {
  return (
    <Link className="tagInfo" to={`/tags/${tag.name}/recipes`}>
      {tag.name}
    </Link>
  );
}
