import React from 'react';

function MyList() {
  const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
  return (
    <ul>
      {items.map((item,index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default MyList;