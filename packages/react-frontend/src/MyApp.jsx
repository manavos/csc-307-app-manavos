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
      .then((res) => {
        if (res.status === 204) {
          const updated = characters.filter(character => character.id !== id);
          setCharacters(updated);
        } else {
          console.log("Error deleting character", res);
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
        .then((newUser) => {
          setCharacters((prevState) => [...prevState, newUser.user]);
        })
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