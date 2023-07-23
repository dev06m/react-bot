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
    
    if (item == null)
    {
        console.log("İtem null geliyor\n");
        return "E";
    }
    const offer_item = {id: item.asset_id.toString(), price: baslangic_fiyati, project: 'csgo', currency: 'USD'}
    
    const response = await axios.post('https://api.shadowpay.com/api/v2/user/offers?token=' + token, 
    {
        offers: [offer_item]
    });

    return response;
}  

export const min_fiyat_getir = async (itemName) =>
{
    console.log(itemName)
    const response = await axios.get('https://api.shadowpay.com/api/v2/user/items/prices?token=' + token, {
        params: {
            search: itemName
        }
    });

    console.log(response.data[0].price)

    return response.data.data[0].price;

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
    debugger
      var satistakiItemler = await GetItemsOnOffers();
      var itemObject = null;

      itemObject =  satistakiItemler.find(item => item.steam_item.steam_market_hash_name === itemName);
  
  
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
    const response = await GetInventoryItems();
    
    return response.find(item => item.asset_id === asset_id);
}
  

