import serverServices from "../services/server";

const Numbers = ({ persons, filter, handleClick }) => {
  return (
    <div>
      {persons
        .filter((person) => RegExp(filter, "ig").test(person.name))
        .map((person) => (
          <div key={person.id}>
            {person.name} {person.number}{" "}
            <button onClick={() => handleClick(person)}>delete</button>
          </div>
        ))}{" "}
    </div>
  );
};

export default Numbers;
