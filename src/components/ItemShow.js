import Table from 'react-bootstrap/Table';


function ItemShow({ item, index }) {
    console.log(index)
  return (
        <tr>
          <td>{index}</td>
          <td>{item.asset_id}</td>
          <td>{item.suggested_price}</td>
          <td>{item.steam_market_hash_name}</td>
        </tr>
  );
}

export default ItemShow;
  