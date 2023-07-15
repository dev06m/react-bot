import { useState } from 'react';
import SearchBar from './components/SearchBar';
import ItemList from './components/ItemList';
import Button from 'react-bootstrap/Button';

import { 
  fetchSellingItems, 
  fetchItems, 
  getItemsOnOffers, 
  FirstPriceSet, 
  ItemFiyatGetir, 
  MakeOffer, 
  SatistakiItemFiyatiGetir, 
  GetItemsOnOffers, 
  GetInventoryItems, 
  fetchItemById
} from './apiMethods'; 

import {
  hile 
} from './api';

import Table from 'react-bootstrap/Table';

  
const sleep = ms => new Promise(r => setTimeout(r, ms));

function App() {
  const [images, setImages] = useState([]);
  const [items, setItems] = useState([]);

  const handleSubmit = async (term) => {
    // const items = await fetchSellingItems();
    // const allItems = await fetchItems();
    var result = await fetchItemById('31520880069');
    

    console.log(result);
  };

  
  return (
    <div>
      <Table striped bordered hover>
            <thead>
                <tr>
                  <th>#</th>
                  <th>Asset Id</th>
                  <th>Price</th>
                  <th>steam Name</th>
                  <th>Başlat</th>
                </tr>
            </thead>
            <tbody>
            <tr>
          <td>1</td>
          <td>item.asset_id</td>
          <td>item.price</td>
          <td>item.steam_item.steam_market_hash_name</td>
          <td><Button variant="success">Basslat</Button></td>
        </tr>
            </tbody>
        </Table>
        <div onClick={hile}>Click</div>
    </div>
  );
}

export default App;
