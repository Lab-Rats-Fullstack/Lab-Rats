import { useState, useEffect } from 'react'


export default function FormTags() {
    const API = "http://localhost:3000/api";
    const [tags, setTags] = useState([]);
    const [tagsOutput, setTagsOutput] = useState([]);

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
    console.log(tags);
    useEffect(() => {
        function rearrange (input, field) {
            let output = [];
            for (let i=0; i < input.length; i++) {
                output.push(input[i][field]);
            }
            return output;
        }

        let rearrTags = rearrange(tags, 'name');
        setTagsOutput(rearrTags);
    }, [tags]);

    return (
        <>
        <form>
        <input list="tags" />
        <datalist id="tags">
            {tags && tagsOutput ? tagsOutput.map((tag) => {
                return <option value={tag} key={tag}/>
            }) : <p>error</p>}
        </datalist>
        </form>
        </>
    )
}