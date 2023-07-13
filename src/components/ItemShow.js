import Table from 'react-bootstrap/Table';

// function ItemShow({ item }) {
//     return (
//       <div>
//         Item id: {item.id}, price: {item.price}, steam id {item.steamid}
//       </div>
//     );
//   }
  
//   export default ItemShow;

  

function ItemShow({ item, index }) {
    console.log(index)
  return (
        <tr>
          <td>{index}</td>
          <td>{item.asset_id}</td>
          <td>{item.price}</td>
          <td>{item.steam_item.steam_market_hash_name}</td>
        </tr>
  );
}

export default ItemShow;
  