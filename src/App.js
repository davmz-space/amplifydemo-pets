import './App.css';

import { API } from 'aws-amplify';
import { createPet, deletePet } from "./graphql/mutations";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from 'react';
import { listPets} from "./graphql/queries";

/**
 * Returns the App Component.
 * 
 * @returns The App Component.
 */
function App() {
  const [petData, setPetData] = useState([]);

  useEffect(() => {
    const fetchPets = async() => {
      const response = await API.graphql({
        query: listPets
      });

      return response.data.listPets.items;
    };

    fetchPets().then(pets => setPetData(pets));
  }, [petData]);

  const submitHandler = async(event) => {
    event.preventDefault();

    const { target } = event;

    try {
      await API.graphql({
        query: createPet,
        variables: {
          input: {
            name: target.petName.value,
            description: target.petDescription.value,
            petType: target.petType.value
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePetDelete = async(petID) => {
    await API.graphql({
      query: deletePet,
      variables: {
        input: {
          id: petID
        }
      }
    });
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <input
          name="petName"
          placeholder="Enter a name"
        />

        <input
          name="petDescription"
          placeholder="Enter a description"
        />

        <select name="petType">
          <option
            disabled
            value="none"
          >
            Please select a pet type
          </option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="rabbit">Rabbit</option>
          <option value="turtle">Turtle</option>
        </select>

        <button>Create Pet</button>
      </form>


      <ul>
        {petData.map((pet) => (
          <>
            <li
              onClick={() => handlePetDelete(pet.id)}
              key={pet.id}
              style={{
                listStyle: "none",
                border: "1px solid black",
                margin: "10px",
                width: "200px"
              }}
            >
              <article>
                <h3>{pet.name}</h3>
                <h5>{pet.type}</h5>
                <p>{pet.description}</p>
              </article>
            </li>
          </>
        ))}
      </ul>
    </>
  );
}

export default withAuthenticator(App);
