import { useState, useEffect } from 'react'

export default function FormTags({tagsList, setTagsList}) {
    const API = "http://localhost:3000/api";
    const [tags, setTags] = useState([]);

    useEffect(() => {
        async function getTags() {
            try {
                const response = await fetch (`${API}/tags/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                const result = await response.json();
                setTags(result.rows);
            } catch (error) {
                console.error(error);
            }
        }
        getTags();
    }, []);


    function handleTagChange(e, index) {
        e.preventDefault();
        const {name, value} = e.target;
        const list = [...tagsList];
        list[index][name] = value;
        setTagsList(list);
    };
    
    function handleTagDelete(index) {
        const list = [...tagsList];
        list.splice(index, 1);
        setTagsList(list);
    };

    function handleTagAdd() {
        setTagsList([...tagsList, {tag: ''}]);
        console.log(tagsList);
    };

    return (
        <>
            <datalist id="tags">
                {tags ? tags.map((tag) => {
                    return (
                    <div key={tag.name}>
                        <option value={tag.name}/>
                    </div>
                    )
                }) : <p key='1'>error</p>}
            </datalist>
            <div>
            <label>Tags: </label>
                {tagsList.map((singleTag, index) => {
                    return (
                        <div key={singleTag.tag}>
                            <input type="text" name="tag" value={singleTag.tag} list="tags" onChange={(e) => handleTagChange(e, index)}/>
                            {tagsList.length > 1 && <button type="button" onClick={() => handleTagDelete(index)}>-</button>}
                            {tagsList.length - 1 === index && tagsList.length < 5 && <button type="button" onClick={handleTagAdd}>+</button>}
                        </div>
                    )
                })}
            </div>
        </>
    )
}