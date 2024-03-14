import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormTags from "./FormTags.jsx";
import UploadImage from "../general/UploadImage.jsx";
import defaultImg from "../../assets/Default_pfp.jpeg";
import handleUpload from "../general/handleUpload.js";

export default function NewRecipe({ token, admin }) {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [estTime, setEstTime] = useState("");
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState(null);
  const [tagsList, setTagsList] = useState([{ tag: "Main", selectMode: true }]);
  const [disabled, setDisabled] = useState(false);

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
    const urlObj = {};
    if (formData) {
      const { url } = await handleUpload(formData);
      urlObj.imgurl = url;
    }
    let ingredArray = rearrange(ingredientList, "ingredient");
    let instructArray = rearrange(instructionList, "instruction");
    let noteArray = rearrange(notesList, "note");
    let tagsArray = rearrange(tagsList, "tag");
    if (!tagsArray[0]) tagsArray[0] = "";

    let data = {
      title: title,
      esttime: estTime,
      ingredients: ingredArray,
      procedure: instructArray,
      ...urlObj,
      notes: noteArray,
      tags: tagsArray,
    };

    try {
      const response = await fetch(
        "https://culinary-chronicle.onrender.com/api/recipes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const { id } = await response.json();
      nav(`/recipes/${id}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="createRecipeForm">
        <div className="newFormContainer">
          <div className="formTitleWrapper">
            <label>Title: </label>
            <input
              className="newFormTitle"
              type="text"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>

          <div>
            <FormTags tagsList={tagsList} setTagsList={setTagsList} setDisabled={setDisabled} />
          </div>

          <label>Image: </label>
          <UploadImage setImage={setImage} setFormData={setFormData} />
          {image && (
            <img
              src={image || defaultImg}
              alt={title ? `${title} image.` : "New Recipe Image."}
            />
          )}

          <label>Estimated Time: </label>
          <select
            list="times"
            id="estTime"
            className="estTimeInput"
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
                <div className="inputWrap">
                  <label id="formNumbers">{index + 1}. </label>
                  <input
                    type="text"
                    name="ingredient"
                    className="createFormDynInput"
                    value={singleIngred.ingredient}
                    onChange={(e) => handleIngredientChange(e, index)}
                  />
                  {ingredientList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleIngredientDelete(index)}
                      className="createFormButton"
                    >
                      -
                    </button>
                  )}
                  {ingredientList.length - 1 === index &&
                    ingredientList.length < 20 && (
                      <button
                        type="button"
                        onClick={handleIngredientAdd}
                        className="createFormButton"
                      >
                        +
                      </button>
                    )}
                </div>
              </div>
            );
          })}

          <label>Instructions: </label>
          {instructionList.map((singleInstruct, index) => {
            return (
              <div key={index}>
                <div className="inputWrap">
                  <label id="formNumbers">{index + 1}. </label>
                  <input
                    type="text"
                    name="instruction"
                    className="createFormDynInput"
                    value={singleInstruct.instruction}
                    onChange={(e) => handleInstructionChange(e, index)}
                  />
                  {instructionList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleInstructionDelete(index)}
                      className="createFormButton"
                    >
                      -
                    </button>
                  )}
                  {instructionList.length - 1 === index &&
                    instructionList.length < 20 && (
                      <button
                        type="button"
                        onClick={handleInstructionAdd}
                        className="createFormButton"
                      >
                        +
                      </button>
                    )}
                </div>
              </div>
            );
          })}

          <label>Notes: </label>
          {notesList.map((singleNote, index) => {
            return (
              <div key={index}>
                <div className="inputWrap">
                  <label id="formNumbers">{index + 1}. </label>
                  <input
                    type="text"
                    name="note"
                    className="createFormDynInput"
                    value={singleNote.note}
                    onChange={(e) => handleNoteChange(e, index)}
                  />
                  {notesList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleNoteDelete(index)}
                      className="createFormButton"
                    >
                      -
                    </button>
                  )}
                  {notesList.length - 1 === index && notesList.length < 20 && (
                    <button
                      type="button"
                      onClick={handleNoteAdd}
                      className="createFormButton"
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {disabled && <p>Cannot Submit Until There Are No Blank Tags.</p>}
          <input type="submit" disabled={disabled} id={disabled ? "disabledNewSubmit" : "newSubmit"} value="submit" />
        </div>
      </form>
    </>
  );
}
