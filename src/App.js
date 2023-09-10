import { useState } from 'react';
import SearchBar from './components/SearchBar';
import { showInvenory } from './invenory_methods';
import ItemList from './components/ItemList';
import Button from 'react-bootstrap/Button';
import { makeStyles, Paper, Typography } from '@material-ui/core';

import { 
  fetchSellingItems, 
  fetchItems, 
  getItemsOnOffers, 
  FirstPriceSet, 
  min_fiyat_getir, 
  MakeOffer, 
  SatistakiItemFiyatiGetir, 
  GetItemsOnOffers, 
  GetInventoryItems, 
  fetchItemById
} from './apiMethods'; 

import {
  hile,
  FiyatDegisikligiCheck
} from './api';

import {
  asset_id
} from './consts/Isimlendirmeler.js'

import Table from 'react-bootstrap/Table';

  
const useStyles = makeStyles((theme) => ({
  root: {
    background: 'green', // Yeşil arka plan
    padding: `${theme.spacing(2)}px 0`, // Üst ve alt tarafında boşluk
    textAlign: 'center',
  },
  text: {
    color: 'white', // Beyaz yazı rengi
  },
}));

function App() {
  //const [images, setImages] = useState([]);
  const [items, setItems] = useState([]);
  const [baslangic_fiyat, setBaslangicFiyat] = useState(0);
  const [min_fiyat, setMinFiyat] = useState(0);
  const [kontrol_araligi, setAralik] = useState(0);
  const [x, setX] = useState([]);
  const [sayi, setSayi] = useState(0);
  const classes = useStyles();
  const [rowData, setRowData] = useState([
    { id: 1, value: '' },
    { id: 2, value: '' },
    { id: 3, value: '' },
    // İhtiyaca göre daha fazla satır ekleyebilirsiniz
  ]);


  const fetchInventory = async () => {
    //debugger
    var all_items = await GetInventoryItems();
    debugger
    for (let index = 0; index < all_items[0].length; index++) {
      const min_fiyat = await min_fiyat_getir(all_items[0][index].steam_market_hash_name);
      all_items[0][index] = {...all_items[0][index], min_fiyat: min_fiyat}
    }
    setItems(all_items[0]);
    setX(all_items[1])
  }
  
  const get_min_price = async (steam_name) => {
    //debugger
    const data = await min_fiyat_getir("M4A4 | The Emperor (Battle-Scarred)");
    setSayi(sayi+1)
  }
 
  const handleSubmit = async (item) => {
    debugger
    console.log(item)
    console.log(baslangic_fiyat, min_fiyat, kontrol_araligi)
  }

  // const handleSubmit = (e) => {
  //   e.preventDefault(); // Formun otomatik olarak gönderilmesini engelleyin
  //   console.log('Gönderilen Değer:', inputValue);
  //   // İşlemleri burada yapabilirsiniz
  // };

  const handleInputChange = (e, index) => {
    // rowData dizisini kopyalayın
    const newRowData = [...rowData];
    // Değişen input'un değerini yeni diziye atayın
    const index = newRowData.findIndex((row) => row.id === index);
    if (index !== -1) {
      newRowData[index].value = e.target.value;
      // State'i güncelleyin
      setRowData(newRowData);
    }
  };

  return (
    <div>
       <Button variant="primary" size="lg" class="me-2" onClick={fetchInventory}>
        Envanteri aç
      </Button>
      <Button variant="secondary" size="lg" class="me-2" onClick={get_min_price}>
        Block level button
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>İsim</th>
            <th>-</th>
            <th>Asset Id</th>
            <th>Tavsiye F.</th>
            <th>Site F. - Kendi F.</th>
            <th>Başlangıç Fiyatı</th>
            <th>Min Fiyat</th>
            <th>Kontrol Aralığı</th>
            <th>ITEM ID</th>
            <th>Başlat</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => { console.log(item)
            return (
              <tr key={item.id}>
                <td>{index+1}</td>
                <td>{item.steam_market_hash_name}</td>
                <td>x{item.count}</td>
                <td>{item.asset_id}</td>
                <td>{item.suggested_price}</td>
                <td>{item.min_fiyat}</td>
                <td><input type="number" name="name" step="any" value={baslangic_fiyat} onChange={(e) => handleInputChange(e, index)}/></td>
                <td><input type="number" name="name"  value={min_fiyat} onChange={(e, i) => setMinFiyat(e.target.value)}/></td>
                <td><input type="text" name="name"  value={kontrol_araligi} onChange={(e) => setAralik(e.target.value)}/></td>
                <td>{item.id}</td>
                <td><button onClick={() => handleSubmit(item)}>Başlat</button></td>
             </tr>
            )
          })}
        </tbody>
      </Table>

      <Paper className={classes.root}>
        <Typography variant="h4" className={classes.text}>
          Satıştaki İtemler
        </Typography>
      </Paper>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>İsim</th>
            <th>-</th>
            <th>Id</th>
            <th>Tavsiye F.</th>
            <th>Site F. - Kendi F.</th>
            <th>Başlangıç Fiyatı</th>
            <th>Min Fiyat</th>
            <th>Kontrol Aralığı</th>
            <th>ITEM ID</th>
            <th>Başlat</th>
          </tr>
        </thead>
        <tbody>
          {x.map((item, index) => {
            return (
              <tr key={index}>
                <td>{index+1}</td>
                <td>{item.steam_item.steam_market_hash_name}</td>
                <td>1</td>
                <td>{item.id}</td>
                <td>{item.steam_item.suggested_price}</td>
                <td></td>
                <td><input type="number" name="name" step="any"/></td>
                <td><input type="number" name="name"/></td>
                <td><input type="text" name="name"/></td>
                <td>{item.id}</td>
                <td><button onClick={handleSubmit}>Başlat</button></td>
             </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default App;
