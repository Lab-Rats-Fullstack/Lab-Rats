import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormTags from "./FormTags.jsx";
import UploadImage from "./UploadImage.jsx";
import defaultImg from "../assets/Default_pfp.jpeg";

export default function NewRecipe({ token, admin }) {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [estTime, setEstTime] = useState("");
  const [image, setImage] = useState("");
  const [tagsList, setTagsList] = useState([{ tag: "" }]);

  const [ingredientList, setIngredientList] = useState([{ ingredient: "" }]);
  const [instructionList, setInstructionList] = useState([{ instruction: "" }]);
  const [notesList, setNotesList] = useState([{ note: "" }]);

  function handleIngredientAdd() {
    setIngredientList([...ingredientList, { ingredient: "" }]);
  }

  function handleInstructionAdd() {
    setInstructionList([...instructionList, { instruction: "" }]);
  }

  function handleNoteAdd() {
    setNotesList([...notesList, { note: "" }]);
  }

  function handleIngredientDelete(index) {
    const list = [...ingredientList];
    list.splice(index, 1);
    setIngredientList(list);
  }

  function handleInstructionDelete(index) {
    const list = [...instructionList];
    list.splice(index, 1);
    setInstructionList(list);
  }

  function handleNoteDelete(index) {
    const list = [...notesList];
    list.splice(index, 1);
    setNotesList(list);
  }

  function handleIngredientChange(e, index) {
    e.preventDefault();
    const { name, value } = e.target;
    const list = [...ingredientList];
    list[index][name] = value;
    setIngredientList(list);
  }

  function handleInstructionChange(e, index) {
    e.preventDefault();
    const { name, value } = e.target;
    const list = [...instructionList];
    list[index][name] = value;
    setInstructionList(list);
  }

  function handleNoteChange(e, index) {
    e.preventDefault();
    const { name, value } = e.target;
    const list = [...notesList];
    list[index][name] = value;
    setNotesList(list);
  }

  function rearrange(input, field) {
    let output = [];
    for (let i = 0; i < input.length; i++) {
      output.push(input[i][field]);
    }
    return output;
  }


  useEffect(() => {
    !admin && nav("/");
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    let ingredArray = rearrange(ingredientList, "ingredient");
    let instructArray = rearrange(instructionList, "instruction");
    let noteArray = rearrange(notesList, "note");
    let tagsArray = rearrange(tagsList, "tag");

    let data = {
      title: title,
      esttime: estTime,
      ingredients: ingredArray,
      procedure: instructArray,
      ...image,
      notes: noteArray,
      tags: tagsArray,
    };
    console.log(data);
    try {
      const response = await fetch("http://localhost:3000/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const { id } = await response.json();
      nav(`/recipes/${id}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Title: </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />

        <label>Estimated Time: </label>
        <select
          list="times"
          id="estTime"
          name="estTime"
          onChange={(e) => {
            setEstTime(e.target.value);
          }}
        >
          <option value="15 min">15 min</option>
          <option value="30 min">30 min</option>
          <option value="45 min">45 min</option>
          <option value="60 min">60 min</option>
          <option value="75 min">75 min</option>
          <option value="90 min">90 min</option>
        </select>

        <label>Ingredients: </label>
        {ingredientList.map((singleIngred, index) => {
          return (
            <div key={index}>
              <input
                type="text"
                name="ingredient"
                value={singleIngred.ingredient}
                onChange={(e) => handleIngredientChange(e, index)}
              />
              {ingredientList.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleIngredientDelete(index)}
                >
                  -
                </button>
              )}
              {ingredientList.length - 1 === index &&
                ingredientList.length < 20 && (
                  <button type="button" onClick={handleIngredientAdd}>
                    +
                  </button>
                )}
            </div>
          );
        })}

        <label>Instructions: </label>
        {instructionList.map((singleInstruct, index) => {
          return (
            <div key={index}>
              <input
                type="text"
                name="instruction"
                value={singleInstruct.instruction}
                onChange={(e) => handleInstructionChange(e, index)}
              />
              {instructionList.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleInstructionDelete(index)}
                >
                  -
                </button>
              )}
              {instructionList.length - 1 === index &&
                instructionList.length < 20 && (
                  <button type="button" onClick={handleInstructionAdd}>
                    +
                  </button>
                )}
            </div>
          );
        })}

        <label>Image: </label>
        <UploadImage setEncoded={setImage} />
        {image.base64 && (
          <img
            src={image.base64 || defaultImg}
            alt={title ? `${title} image.` : "New Recipe Image."}
          />
        )}

        <label>Notes: </label>
        {notesList.map((singleNote, index) => {
          return (
            <div key={index}>
              <input
                type="text"
                name="note"
                value={singleNote.note}
                onChange={(e) => handleNoteChange(e, index)}
              />
              {notesList.length > 1 && (
                <button type="button" onClick={() => handleNoteDelete(index)}>
                  -
                </button>
              )}
              {notesList.length - 1 === index && notesList.length < 20 && (
                <button type="button" onClick={handleNoteAdd}>
                  +
                </button>
              )}
            </div>
          );
        })}

        <div>
          <FormTags tagsList={tagsList} setTagsList={setTagsList} />
        </div>

        <input type="submit" id="submit" value="submit" />
      </form>
    </div>
  );
}
