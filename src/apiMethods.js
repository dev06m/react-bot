import axios from 'axios';
import { token } from './consts/Isimlendirmeler';


// export const searchImages = async (term) => {
//     const response = await axios.get('https://api.unsplash.com/search/photos', {
//       headers: {
//         Authorization: 'Client-ID 8O50V7bNzfKdVixwS9W9nZVdr0VnrCv9gmeimfdvp6Y',
//       },
//       params: {
//         query: term,
//       },
//     });
  
//     return response.data.results;
//   };
  
export const fetchSellingItems = async () => {
    const response = await axios.get('https://api.shadowpay.com/api/v2/user/offers?token=' + token);

    return response.data.data;
}

export const fetchItems = async () => {
    const response = await axios.get('https://api.shadowpay.com/api/v2/user/items?token=' + token, 
);

return response.data.data;
}



export const FirstPriceSet = async (item, baslangic_fiyati, minimum_fiyat, bir_saat_bekle) => {
    //const item = [{id:'31084109034', price: 40, project: 'csgo', currency: 'USD'}]

    const response = await axios.post('https://api.shadowpay.com/api/v2/user/offers?token=' + token, 
    {
        offers: item
    });

    return response;
}  

export const ItemFiyatGetir = async (itemName) =>
{
    const response = await axios.get('https://api.shadowpay.com/api/v2/user/items/prices?token=' + token);

    return response.data.data;

}

export const MakeOffer = async (itemm, price, miliseconds) => { // update yaparken

    const item = [{id:'31084109034', price: 40, project: 'csgo', currency: 'USD'}] // update yaptigimiz icin id olmasi lazim (item id si)
        
    const response = await axios.post('https://api.shadowpay.com/api/v2/user/offers?token=' + token, 
    {
        offers: item
    });

    return response;

}

export const SatistakiItemFiyatiGetir = async (itemName) =>
  {
      var satistakiItemler = await GetItemsOnOffers();
      var itemObject = null;

      itemObject =  satistakiItemler.find(item => item.steam_item.steam_market_hash_name === 'StatTrak™ AK-47 | Rat Rod (Field-Tested)');
  
  
      return itemObject.price;  
}
  
export const GetItemsOnOffers = async () =>
  {
    const response = await axios.get('https://api.shadowpay.com/api/v2/user/offers?token=' + token);
    
    return response.data.data;
}
  

export const GetInventoryItems = async () => {
    const response = await axios.get('https://api.shadowpay.com/api/v2/user/inventory?token=' + token);
    
    return response.data.data;
}

export const fetchItemById = async (asset_id) => {
    const response = await GetInventoryItems();;

    return response.find(item => item.asset_id === asset_id);
}
  

