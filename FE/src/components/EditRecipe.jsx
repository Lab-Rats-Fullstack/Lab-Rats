import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormTags from "./FormTags.jsx";
import UploadImage from "./UploadImage.jsx";
import defaultImg from "../assets/Default_pfp.jpeg";
import Loading from "./Loading.jsx";

export default function EditRecipe({ token, admin }) {
  const [loading, setLoading] = useState(true);
  const API = "http://localhost:3000/api/";
  const { recipeId } = useParams();
  const navigate = useNavigate();

  const [recipeObj, setRecipeObj] = useState({});
  const [responseVar, setResponseVar] = useState("");
  const [title, setTitle] = useState("");
  const [estTime, setEstTime] = useState("");
  const [image, setImage] = useState("");
  const [tagsList, setTagsList] = useState([{ tag: "" }]);

  const [ingredientList, setIngredientList] = useState([{ ingredient: "" }]);
  const [instructionList, setInstructionList] = useState([{ instruction: "" }]);
  const [notesList, setNotesList] = useState([{ note: "" }]);

  useEffect(() => {
    async function getRecipeById() {
      try {
        const response = await fetch(`${API}recipes/${recipeId}`, {
          method: "GET",
          header: `Bearer ${token}`,
        });
        const result = await response.json();
        setResponseVar(response.ok);
        const recipe = result.recipe;
        setRecipeObj(recipe);
        setTitle(recipe.title);
        setEstTime(recipe.esttime);

        function setInitialIngred(array) {
          let initialArray = [];
          if (array.length >= 1) {
            array.map((element) => {
              initialArray.push({ ingredient: element });
            });
          }

          setIngredientList(initialArray);
        }

        function setInitialInstruct(array) {
          let initialArray = [];
          if (array) {
            array.map((element) => {
              initialArray.push({ instruction: element });
            });
          }
          setInstructionList(initialArray);
        }

        function setInitialNotes(array) {
          let initialArray = [];
          if (array.length >= 1) {
            array.map((element) => {
              initialArray.push({ note: element });
            });
          } else {
            initialArray.push({ note: "" });
          }

          setNotesList(initialArray);
        }

        function setInitialTags(array) {
          function rearrange(input, field) {
            let output = [];
            for (let i = 0; i < input.length; i++) {
              output.push(input[i][field]);
            }
            return output;
          }

          if (array.length >= 1) {
            let newTagsArray = rearrange(array, "name");

            let initialArray = [];
            if (newTagsArray.length >= 1) {
              newTagsArray.map((element) => {
                initialArray.push({ tag: element });
              });
            }
            setTagsList(initialArray);
          }
        }

        if (Object.keys(recipeObj).length >= 1) {
          setInitialIngred(recipeObj.ingredients);
          setInitialTags(recipeObj.tags);
          setInitialInstruct(recipeObj.procedure);
          setInitialNotes(recipeObj.notes);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    getRecipeById();
  }, [responseVar]);

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
    !admin && navigate("/");
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    let ingredArray = rearrange(ingredientList, "ingredient");
    let instructArray = rearrange(instructionList, "instruction");
    let noteArray = rearrange(notesList, "note");
    let tagsArray = rearrange(tagsList, "tag");
    if(!tagsArray[0]) tagsArray[0] = "";

    let data = {
      title: title,
      esttime: estTime,
      ingredients: ingredArray,
      procedure: instructArray,
      ...image,
      notes: noteArray,
      tags: tagsArray,
    };
    console.log(data.title);
    try {
      const response = await fetch(`${API}recipes/${recipeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
    alert("Edit was successful");
    navigate(`/recipes/${recipeId}`);
  }

  return (
  <>
      {loading ? (
        <Loading />
      ) : (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="newFormContainer">
            <div className="formTitleWrapper">
              <label>Title: </label>
                <input
                  type="text"
                  id="newFormTitle"
                  name="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
            </div>

            <div>
              <FormTags tagsList={tagsList} setTagsList={setTagsList} />
            </div>

            <label>Image: </label>
              <UploadImage setEncoded={setImage} />
              {recipeObj.imgurl && !image.base64 && (
                <img
                  src={recipeObj.imgurl}
                  alt={title ? `${title} image.` : "New Recipe Image."}
                />
              )}
              {image.base64 && (
                <img
                  src={image.base64 || defaultImg}
                  alt={title ? `${title} image.` : "New Recipe Image."}
                />
              )}

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
                    <div className="inputWrap">
                      <label id="formNumbers">{index+1}. </label>
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
                  </div>
                );
              })}

            <label>Instructions: </label>
            {instructionList.map((singleInstruct, index) => {
              return (
                <div key={index}>
                  <div className="inputWrap">
                    <label id="formNumbers">{index+1}. </label>
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
                </div>
              );
            })}

            <label>Notes: </label>
            {notesList.map((singleNote, index) => {
              return (
                <div key={index}>
                  <div className="inputWrap">
                    <label id="formNumbers">{index+1}. </label>
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
                </div>
              );
            })}

            <input type="submit" id="newSubmit" value="submit changes" />
          </div>
      </form>
    </div>
      )}
    </>
  );
}
