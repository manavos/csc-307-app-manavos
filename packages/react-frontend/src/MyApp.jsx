import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form"
  
  function MyApp() {
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
      fetchUsers()
        .then((res) => res.json())
        .then((json) => setCharacters(json["users_list"]))
        .catch((error) => {
          console.log(error);
        });
    }, []);

    function removeOneCharacter(id) {

      fetch(`http://localhost:8000/users/${id}`, {
        method: 'DELETE'
      })
      .then((res) => res.json()) //added so its in json format
      .then((json) => {
        if (json.deletedCount === 1) {
          const updated = characters.filter(character => character._id !== id);
          setCharacters(updated);    // update the frontend
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }

    function postUser(person) {
      const promise = fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(person)
      });
    
      return promise;
    }

    function updateList(person) {
      postUser(person)
        .then((res) =>
          res.status === 201
            ? res.json()
            : Promise.reject(`Unexpected status code: ${res.status}`)
        )
        .then(() => {
          return fetchUsers();
        })
        //added 2 lines so table shows when submit it pressed
        .then((res) => res.json())
        .then((json) => setCharacters(json["users_list"]))
        .catch((error) => {
          console.log(error);
        });
    }

    return (
      <div className="container">
        <Table 
        characterData={characters} 
        removeCharacter={removeOneCharacter}
        />
        <Form handleSubmit={updateList} />
      </div>
    );
    


  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }


export default MyApp;