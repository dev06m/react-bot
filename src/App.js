import './style.css'; // Yeni CSS dosyasını içeri aktarın

import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import { showInvenory } from './invenory_methods';
import ItemList from './components/ItemList';
import Button from 'react-bootstrap/Button';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { css } from "@emotion/react";
import { RingLoader } from "react-spinners";
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Table from 'react-bootstrap/Table';
import { blueGrey } from '@mui/material/colors';

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


const useStyles = makeStyles((theme) => ({
  root: {
    background: 'green', // Yeşil arka plan
    padding: `${theme.spacing(2)}px 0`, // Üst ve alt tarafında boşluk
    textAlign: 'center',
  },
  text: {
    color: 'white', // Beyaz yazı rengi
  },
  myDiv: {
    margin: '0 150px',
  },
}));

function App() {
  const [isLoading, setisLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [x, setX] = useState([]);
  const [sayi, setSayi] = useState(0);
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    setisLoading(true);
    var all_items =  await GetInventoryItems();
    var item_prices = await min_fiyat_getir_envanter();
    console.log(item_prices)
    for (let index = 0; index < all_items[0].length; index++) {
      //const min_fiyat = await min_fiyat_getir(all_items[0][index].steam_market_hash_name);
      const min_fiyat = item_prices.find(item => item.steam_market_hash_name === all_items[0][index].steam_market_hash_name)?.price;
      all_items[0][index] = {...all_items[0][index], min_fiyat: min_fiyat ? min_fiyat : '-'}
    }

    setisLoading(false);
    setItems(all_items[0]);
}, []);

  const fetchInventory = async () => {
    setisLoading(true);
    var all_items =  await GetInventoryItems();
    var item_prices = await min_fiyat_getir_envanter();
    console.log(item_prices)
    for (let index = 0; index < all_items[0].length; index++) {
      //const min_fiyat = await min_fiyat_getir(all_items[0][index].steam_market_hash_name);
      const min_fiyat = item_prices?.find(item => item.steam_market_hash_name === all_items[0][index].steam_market_hash_name).price;
      all_items[0][index] = {...all_items[0][index], min_fiyat: min_fiyat ? min_fiyat : '-'}
    }
    for (let index = 0; index < all_items[1].length; index++) {
      //const min_fiyat =  min_fiyat_getir(all_items[1][index].steam_item.steam_market_hash_name);
      const min_fiyat = item_prices?.find(item => item.steam_market_hash_name === all_items[1][index].steam_item.steam_market_hash_name).price;
      all_items[1][index] = {...all_items[1][index], min_fiyat: min_fiyat ? min_fiyat : '-'}
    }
    setisLoading(false);
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
      item.baslangic_fiyati = item_data.baslangic_fiyati != undefined ? item_data.baslangic_fiyati : item.suggested_price; 
      item.minimum_fiyat = item_data.minimum_fiyat;
      item.kontrol_araligi = item_data.kontrol_araligi;  
    }
  
    let result;
      setInterval(async () => { // 100 kez kontrol edildi 1 dk bekleme buraya yapilabilir
        
        console.log(`${item.steam_market_hash_name} için task başlıyor.`)
        result = await FiyatDegisikligiCheck(item);
        
        if(result) {
          
          await hile(item)
        }

      }, 4000)
    // }
    if (result)
      console.log(result)
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
        {isLoading ? (<RingLoader color={"#123abc"} loading={loading} css={override} size={150} />)
        :
       (
        <div className={classes.myDiv}>
          <Button variant="primary" size="lg" class="me-2" onClick={fetchInventory}>
            Envanteri aç
          </Button>
          <Button variant="secondary" size="lg" class="me-2" onClick={deneme}>
            Block level button
          </Button>
          <Paper className={classes.root}>
            <Typography variant="h4" className={classes.text}>
              Envanterdeki İtemler
            </Typography>
          </Paper>
        
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th class="th-lg">İsim</th>
                <th style={{ backgroundColor: blueGrey }}>-</th>
                <th>Asset Id</th>
                <th class="th-sm">Tavsiye F.</th>
                <th>Site F. - Kendi F.</th>
                <th class="th-sm">Başlangıç Fiyatı</th>
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
                    <td style={{ backgroundColor: blueGrey }}>{index+1}</td>
                    <td>{item.steam_market_hash_name}</td>
                    <td>x{item.count}</td>
                    <td>{item.asset_id}</td>
                    <td>{item.suggested_price}</td>
                    <td>{item.min_fiyat}</td>
                    <td><input style={{width: '100px'}} type="number" name="name" value={item.baslangic_fiyati} onChange={(e) => handleBaslangicFiyatChange(e, item.id)}/></td>
                    <td><input style={{width: '100px'}} type="number" name="name"  value={item.minimum_fiyat} onChange={(e) => handleMinFiyatChange(e, item.id)}/></td>
                    <td><input style={{width: '100px'}} type="number" name="name"  value={item.kontrol_araligi} onChange={(e) => handleKontrolAraligiChange(e, item.id)}/></td>
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
                    <td><input style={{width: '100px'}} type="number" name="name" value={item.baslangic_fiyati} onChange={(e) => handleBaslangicFiyatChange(e, item.id)}/></td>
                    <td><input style={{width: '100px'}} type="number" name="name"  value={item.minimum_fiyat} onChange={(e) => handleMinFiyatChange(e, item.id)}/></td>
                    <td><input style={{width: '100px'}} type="number" name="name"  value={item.kontrol_araligi} onChange={(e) => handleKontrolAraligiChange(e, item.id)}/></td>
                    <td>{item.id}</td>
                    <td><button onClick={() => handleSubmit(item)}>Başlat</button></td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
       )}
    </div>
  );
}

const override = css`
    display: block;
    margin: 0 auto;
`;


export default App;
