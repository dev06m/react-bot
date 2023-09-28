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
  min_fiyat_getir_envanter, 
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
  const [data, setData] = useState([]);


  const fetchInventory = async () => {
    var all_items =  await GetInventoryItems();
    var item_prices = await min_fiyat_getir_envanter();
    console.log(item_prices)
    for (let index = 0; index < all_items[0].length; index++) {
      //const min_fiyat = await min_fiyat_getir(all_items[0][index].steam_market_hash_name);
      const min_fiyat = item_prices.find(item => item.steam_market_hash_name === all_items[0][index].steam_market_hash_name).price;
      all_items[0][index] = {...all_items[0][index], min_fiyat: min_fiyat ? min_fiyat : '-'}
    }
    for (let index = 0; index < all_items[1].length; index++) {
      //const min_fiyat =  min_fiyat_getir(all_items[1][index].steam_item.steam_market_hash_name);
      const min_fiyat = item_prices.find(item => item.steam_market_hash_name === all_items[1][index].steam_item.steam_market_hash_name).price;
      all_items[1][index] = {...all_items[1][index], min_fiyat: min_fiyat ? min_fiyat : '-'}
    }
    setItems(all_items[0]);
    setX(all_items[1])
  }
  
  const deneme =  () => {
    let price = 0
    price =  min_fiyat_getir_envanter("M4A4 | The Emperor (Battle-Scarred)");
    console.log('price: ', price)
  }
 
  const handleSubmit = async (item) => {
    let dongu = true;
    const item_data = data.find(x => x.id === item.id);
    if (item_data) {
      item.baslangic_fiyati = item_data.baslangic_fiyati; 
      item.minimum_fiyat = item_data.minimum_fiyat;
      item.kontrol_araligi = item_data.kontrol_araligi;  
    }
  
    let result;
      setInterval(async () => { // 100 kez kontrol edildi 1 dk bekleme buraya yapilabilir
        debugger
        console.log(`${item.steam_market_hash_name} için task başlıyor.`)
        result = await FiyatDegisikligiCheck(item);
        
        if(result) {
          debugger
          await hile(item)
        }

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
      data.push({id: id, minimum_fiyat: value})
    else {
      data.map((i, index) => {
          if(i.id === id) 
            data[index].minimum_fiyat = value
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
      <Button variant="secondary" size="lg" class="me-2" onClick={deneme}>
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
            //item = {...item, baslangic_fiyati: null, minimum_fiyat: null, kontrol_araligi: null}
            return (
              <tr key={item.id}>
                <td>{index+1}</td>
                <td>{item.steam_market_hash_name}</td>
                <td>x{item.count}</td>
                <td>{item.asset_id}</td>
                <td>{item.suggested_price}</td>
                <td>{item.min_fiyat}</td>
                <td><input type="number" name="name" value={item.baslangic_fiyati} onChange={(e) => handleBaslangicFiyatChange(e, item.id)}/></td>
                <td><input type="number" name="name"  value={item.minimum_fiyat} onChange={(e) => handleMinFiyatChange(e, item.id)}/></td>
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
            //item = {...item, baslangic_fiyati: null, minimum_fiyat: null, kontrol_araligi: null}
            return (
              <tr key={item.id}>
                <td>{index+1}</td>
                <td>{item.steam_item.steam_market_hash_name}</td>
                <td>x{item.count}</td>
                <td>{item.asset_id}</td>
                <td>{item.steam_item.suggested_price}</td>
                <td>{item.min_fiyat} - {item.price}</td>
                <td><input type="number" name="name" value={item.baslangic_fiyati} onChange={(e) => handleBaslangicFiyatChange(e, item.id)}/></td>
                <td><input type="number" name="name"  value={item.minimum_fiyat} onChange={(e) => handleMinFiyatChange(e, item.id)}/></td>
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
