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
  const [x, setX] = useState([]);
  const [sayi, setSayi] = useState(0);
  const classes = useStyles();
  const [data, setData] = useState([
    // { id: 1, baslangic_fiyati: '1', min_fiyat: '', kontrol_araligi: 0}
  ]);


  const fetchInventory = async () => {
    var all_items = await GetInventoryItems();
    for (let index = 0; index < all_items[0].length; index++) {
      const minimum_fiyat = await min_fiyat_getir(all_items[0][index].steam_market_hash_name);
      all_items[0][index] = {...all_items[0][index], minimum_fiyat: minimum_fiyat ? minimum_fiyat : '-'}
    }
    for (let index = 0; index < all_items[1].length; index++) {

      console.log(all_items[1][index])
      const minimum_fiyat = await min_fiyat_getir(all_items[1][index].steam_item.steam_market_hash_name);
      all_items[1][index] = {...all_items[1][index], minimum_fiyat: minimum_fiyat ? minimum_fiyat : '-'}
    }
    setItems(all_items[0]);
    setX(all_items[1])
  }
  
  const get_min_price = async (steam_name) => {
    const data = await min_fiyat_getir("M4A4 | The Emperor (Battle-Scarred)");
    setSayi(sayi+1)
  }
 
  const handleSubmit = async (item) => {
    //debugger
    let dongu = true;
    const item_data = data.find(x => x.id === item.id);
    if (item_data) {
      item.baslangic_fiyati = item_data.baslangic_fiyati; 
      item.min_fiyat = item_data.min_fiyat;
      item.kontrol_araligi = item_data.kontrol_araligi;  
    }
  
    let result;
      setInterval(async () => { // 100 kez kontrol edildi 1 dk bekleme buraya yapilabilir
        result = await FiyatDegisikligiCheck(item);
        
        if(result)
          await hile(item)

      }, 2000)
    // }
    if (result)
      console.log(result)
    // setInterval(() => {
    //     hile(item);
    // }, item.kontrol_araligi)
  }


  const handleBaslangicFiyatChange = (e, id) => {
    const { value } = e.target;
    if (!data.find(i => i.id === id))
      data.push({id: id, baslangic_fiyati: value})
    else {
      data.map((i, index) => {
          if(i.id === id) 
            data[index].baslangic_fiyati = value
    })
    }
  };

    const handleMinFiyatChange = (e, id) => {
    const { value } = e.target;
    if (!data.find(i => i.id === id))
      data.push({id: id, min_fiyat: value})
    else {
      data.map((i, index) => {
          if(i.id === id) 
            data[index].min_fiyat = value
    })
    }
  };

    const handleKontrolAraligiChange = (e, id) => {
    const { value } = e.target;
    if (!data.find(i => i.id === id))
      data.push({id: id, kontrol_araligi: value})
    else {
      data.map((i, index) => {
          if(i.id === id) 
            data[index].kontrol_araligi = value
    })
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
          {items.map((item, index) => { 
            item = {...item, baslangic_fiyati: null, min_fiyat: null, kontrol_araligi: null}
            return (
              <tr key={item.id}>
                <td>{index+1}</td>
                <td>{item.steam_market_hash_name}</td>
                <td>x{item.count}</td>
                <td>{item.asset_id}</td>
                <td>{item.suggested_price}</td>
                <td>{item.minimum_fiyat}</td>
                <td><input type="number" name="name" value={item.baslangic_fiyati} onChange={(e) => handleBaslangicFiyatChange(e, item.id)}/></td>
                <td><input type="number" name="name"  value={item.min_fiyat} onChange={(e) => handleMinFiyatChange(e, item.id)}/></td>
                <td><input type="number" name="name"  value={item.kontrol_araligi} onChange={(e) => handleKontrolAraligiChange(e, item.id)}/></td>
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
          {x.map((item, index) => {
            console.log(item)
            item = {...item, baslangic_fiyati: null, min_fiyat: null, kontrol_araligi: null}
            return (
              <tr key={item.id}>
                <td>{index+1}</td>
                <td>{item.steam_item.steam_market_hash_name}</td>
                <td>x{item.count}</td>
                <td>{item.asset_id}</td>
                <td>{item.steam_item.suggested_price}</td>
                <td>{item.minimum_fiyat}</td>
                <td><input type="number" name="name" value={item.baslangic_fiyati} onChange={(e) => handleBaslangicFiyatChange(e, item.id)}/></td>
                <td><input type="number" name="name"  value={item.min_fiyat} onChange={(e) => handleMinFiyatChange(e, item.id)}/></td>
                <td><input type="number" name="name"  value={item.kontrol_araligi} onChange={(e) => handleKontrolAraligiChange(e, item.id)}/></td>
                <td>{item.id}</td>
                <td><button onClick={() => handleSubmit(item)}>Başlat</button></td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default App;
